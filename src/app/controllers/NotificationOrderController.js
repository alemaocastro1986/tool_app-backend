import { Op } from 'sequelize';
import Order from '../models/Order';
import Company from '../models/Company';
import Client from '../models/Client';

class NotificationOrderController {
  async index(req, res) {
    const notifications = await Order.findAll({
      where: {
        status: {
          [Op.in]: ['opened', 'pending'],
        },
      },
      attributes: ['id', 'status', 'created_at'],
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

    return res.json(notifications);
  }
}

export default new NotificationOrderController();
