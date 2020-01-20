import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import * as Yup from 'yup';

import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Tool from '../models/Tool';
import Client from '../models/Client';
import Company from '../models/Company';
import Occupation from '../models/Occupation';

import AuthorizationMail from '../jobs/AuthorizationMail';
import Queue from '../services/Queue';
import StartGpspTask from '../jobs/StartGpspTask';

class OrderController {
  async index(req, res) {
    const {
      page = 1,
      limit = 30,
      date = new Date(),
      status = 'all',
    } = req.query;
    const orders = await Order.findAll({
      where: {
        status: {
          [Op.in]:
            status !== 'all'
              ? [`${status}`]
              : ['opened', 'pending', 'closeded'],
        },
        created_at: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      attributes: [
        'id',
        'status',
        'client_id',
        'authorizing_client_id',
        'has_occurrency',
        'created_at',
      ],
      limit,
      offset: (page - 1) * 30,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'register'],
          include: [
            {
              model: Company,
              as: 'company',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async show(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      attributes: [
        'id',
        'status',
        'client_id',
        'authorizing_client_id',
        'created_at',
      ],
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'quantity', 'quantity_returned'],
          include: [
            {
              model: Tool,
              as: 'tool',
              attributes: ['id', 'description', 'is_restricted'],
            },
          ],
        },
      ],
    });

    return res.json(order);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      client_id: Yup.string().required(),
      has_occurrency: Yup.bool().default(false),
      user_id: Yup.string(),
      authorizing_client_id: Yup.string(),
      status: Yup.string()
        .oneOf(['opened', 'closeded'])
        .default('opened'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation Fails' });
    }

    const { client_id, authorizing_client_id } = req.body;

    const defaults = !authorizing_client_id
      ? {
          client_id,
          user_id: req.userId,
        }
      : {
          client_id,
          user_id: req.userId,
          authorizing_client_id,
        };

    const [order, created] = await Order.findOrCreate({
      where: {
        client_id,
        status: 'opened',
      },
      defaults,
    });

    if (order && !created) {
      return res.status(400).json({
        error: 'There is already an open order for this client.',
      });
    }

    if (authorizing_client_id) {
      const authorizing = await Client.findByPk(authorizing_client_id);
      const client = await Client.findByPk(order.client_id, {
        attributes: ['id', 'name', 'register', 'can_authorize'],
        include: [
          { model: Company, as: 'company', attributes: ['name'] },
          { model: Occupation, as: 'occupation', attributes: ['name'] },
        ],
      });

      await Queue.add(AuthorizationMail.key, {
        authorizing,
        client,
      });
    }

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      has_occurrency: Yup.bool().default(false),
      status: Yup.string()
        .oneOf(['closeded', 'pending'])
        .default('closeded'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;
    const { has_occurrency, status } = req.body;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'quantity', 'quantity_returned'],
          include: [
            {
              model: Tool,
              as: 'tool',
              attributes: ['id', 'description', 'is_restricted'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found.' });
    }

    await order.update({
      status,
      has_occurrency,
    });

    if (order.status === 'closeded' && has_occurrency === true) {
      const items = order.items.map(i => i.tool.description).join(':');
      const client = await Client.findByPk(order.client_id);
      await Queue.add(StartGpspTask.key, {
        id,
        client,
        items,
      });
    }

    return res.json(order);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found.' });
    }

    await order.destroy();

    return res.status(204).json();
  }
}

export default new OrderController();
