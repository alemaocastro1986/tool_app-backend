import { Op } from 'sequelize';
import * as Yup from 'yup';
import Tool from '../models/Tool';
import Stock from '../models/Stock';

class ToolController {
  async index(req, res) {
    const { page = 1, limit = 20, description } = req.query;

    const { docs: data, pages, total } = await Tool.paginate({
      where: description
        ? {
            description: {
              [Op.iLike]: `%${description}%`.toUpperCase(),
            },
          }
        : {},
      attributes: ['id', 'description', 'is_restricted'],
      page,
      paginate: limit,
      order: ['description'],
      include: [{ model: Stock, as: 'stock', attributes: ['id', 'quantity'] }],
    });

    const tools = {
      data,
      paginate: {
        current: Number(page),
        pages,
		total
      },
    };

    return res.json(tools);
  }
  
  async show(req, res){
	  const {id} = req.params;
	  
	  const tool = await Tool.findByPk(id, {
		  include: [
		  {model: Stock, as: 'stock' , attributes:['id', 'quantity']},
		  ]
	  });
	  
	  if (!tool) {
      return res.status(400).json({ error: 'Tool not found.' });
    }
	
	return res.json(tool);
	  
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string()
        .min(5)
        .max(150)
        .required(),
      is_restricted: Yup.bool().default(false),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation fails' });
    }

    const tool = await Tool.create(req.body);
    return res.json(tool);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string()
        .min(5)
        .max(150),
      is_restricted: Yup.bool().default(false),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const tool = await Tool.findByPk(id);

    if (!tool) {
      return res.status(400).json({ error: 'Tool not found.' });
    }

    await tool.update(req.body);

    return res.json(tool);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const tool = await Tool.findByPk(id);

    if (!tool) {
      return res.status(400).json({ error: 'Tool not found' });
    }

    await tool.destroy();

    return res.status(204).json();
  }
}

export default new ToolController();
