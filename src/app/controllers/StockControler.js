import { Op } from 'sequelize';
import * as Yup from 'yup';

import Stock from '../models/Stock';
import Tool from '../models/Tool';
import User from '../models/User';

import Queue from '../services/Queue';
import ChangeStockMail from '../jobs/ChangeStockMail';

class StockController {
  async index(req, res) {
    const { description } = req.query;
    const stocks = await Stock.findAll({
      attributes: [
        'id',
        'quantity',
        'in_reserve',
        'available',
        'tool_id',
        'created_at',
      ],
      include: [
        {
          model: Tool,
          as: 'tool',
          attributes: ['id', 'description', 'is_restricted'],
          where: description
            ? {
                description: {
                  [Op.iLike]: `%${description}%`.toUpperCase(),
                },
              }
            : {},
        },
      ],
      order: [['tool', 'description']],
    });

    return res.json(stocks);
  }

  async update(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;

    const stock = await Stock.findByPk(id, {
      include: [
        {
          model: Tool,
          as: 'tool',
          attributes: ['id', 'description', 'is_restricted'],
        },
      ],
    });

    if (!stock) {
      return res
        .status(400)
        .json({ error: 'Não encontrado estoque para esta ferramenta' });
    }

    const stockHistory = {
      tool_id: stock.tool.id,
      tool: stock.tool.description,
      oldQuantity: stock.quantity,
      newQuantity: quantity,
    };
    stock.quantity = quantity;

    await stock.save();

    const user = await User.findByPk(req.userId);

    await Queue.add(ChangeStockMail.key, { user, stockHistory });

    return res.json(stock);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      tool_id: Yup.string().required(),
      quantity: Yup.number()
        .positive()
        .integer()
        .default(0)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({
        error: 'Validation fails',
      });
    }

    const stock = await Stock.create(req.body);

    return res.json(stock);
  }
}

export default new StockController();
