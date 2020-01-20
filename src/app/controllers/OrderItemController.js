import * as Yup from 'yup';

import OrderItem from '../models/OrderItem';
import Tool from '../models/Tool';
import Stock from '../models/Stock';
import Order from '../models/Order';

class OrderItemController {
  async index(req, res) {
    const { id } = req.params;

    const orderItems = await OrderItem.findAll({
      where: {
        order_id: id,
      },
      attributes: ['id', 'quantity', 'quantity_returned', 'order_id'],
      include: [
        {
          model: Tool,
          as: 'tool',
          attributes: ['id', 'description', 'is_restricted'],
        },
      ],
    });

    return res.json(orderItems);
  }

  async create(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      tool_id: Yup.string().required(),
      quantity: Yup.number()
        .positive()
        .min(1)
        .required()
        .default(1),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }

    const stock = await Stock.findOne({
      where: {
        tool_id: req.body.tool_id,
      },
    });

    if (stock.available < req.body.quantity) {
      return res
        .status(400)
        .json({ error: 'This tool has no stock available' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({
        error: 'Order not found',
      });
    }

    const orderItem = await OrderItem.create({
      order_id: id,
      ...req.body,
    });

    await stock.addReserve(req.body.quantity);
    await stock.save();

    return res.json(orderItem);
  }

  async update(req, res) {
    const { id, item_id } = req.params;
    const { quantity_returned, quantity } = req.body;
    const schema = Yup.object().shape({
      quantity_returned: Yup.number().positive(),
      quantity: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails.',
      });
    }

    const orderItem = await OrderItem.findOne({
      where: {
        order_id: id,
        id: item_id,
      },
    });

    if (!orderItem) {
      return res.status(400).json({
        error: 'Order Item not found.',
      });
    }

    const stock = await Stock.findOne({
      where: {
        tool_id: orderItem.tool_id,
      },
    });

    if (quantity && quantity !== orderItem.quantity) {
      if (quantity < orderItem.quantity) {
        stock.removeReserve(orderItem.quantity - quantity);
      }

      if (
        quantity > orderItem.quantity &&
        quantity - orderItem.quantity <= stock.available
      ) {
        stock.addReserve(quantity - orderItem.quantity);
      } else {
        return res.status(400).json({
          error: 'Quantity is greater than available',
        });
      }

      orderItem.quantity = quantity;
    }

    if (quantity_returned) {
      if (quantity_returned > orderItem.quantity) {
        return res.status(400).json({
          error: 'Return amount greater than output',
        });
      }

      /** if (
        orderItem.quantity - orderItem.quantity_returned <
        quantity_returned
      ) {
        return res.status(400).json({
          error: 'Return amount greater than output',
        });
      } */

      // orderItem.quantity_returned > 0
      // ? orderItem.quantity_returned + quantity_returned
      // : quantity_returned;
      // stock.removeReserve(quantity_returned);

      if (orderItem.quantity_returned <= 0) {
        stock.removeReserve(quantity_returned);
      }

      if (
        orderItem.quantity_returned < quantity_returned &&
        orderItem.quantity_returned > 0
      ) {
        stock.removeReserve(quantity_returned - orderItem.quantity_returned);
      }

      orderItem.quantity_returned = quantity_returned;
    }

    await orderItem.save();
    await stock.save();

    return res.json(orderItem);
  }

  async destroy(req, res) {
    const { id, item_id } = req.params;

    const orderItem = await OrderItem.findOne({
      where: {
        order_id: id,
        id: item_id,
      },
    });

    if (!orderItem) {
      return res.status(400).json({
        error: 'Order Item not found.',
      });
    }

    const stock = await Stock.findOne({
      where: { tool_id: orderItem.tool_id },
    });

    stock.removeReserve(orderItem.quantity - orderItem.quantity_returned);
    await stock.save();

    await orderItem.destroy();
    return res.status(204).json();
  }
}

export default new OrderItemController();
