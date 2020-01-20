import * as Yup from 'yup';

import Client from '../models/Client';
import Company from '../models/Company';
import Occupation from '../models/Occupation';

class ClientController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const clients = await Client.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'register', 'email', 'can_authorize'],
      include: [
        { model: Company, as: 'company', attributes: ['name'] },
        { model: Occupation, as: 'occupation', attributes: ['name'] },
      ],
    });

    return res.json(clients);
  }

  async show(req, res) {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      attributes: ['id', 'name', 'register', 'can_authorize'],
      include: [
        { model: Company, as: 'company', attributes: ['name'] },
        { model: Occupation, as: 'occupation', attributes: ['name'] },
      ],
    });

    if (!client) {
      return res.status(400).json({
        error: 'Client not found.',
      });
    }

    return res.json(client);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      register: Yup.number()
        .integer()
        .positive()
        .required(),
      company_id: Yup.string().required(),
      occupation_id: Yup.string().required(),
      can_authorize: Yup.boolean().default(false),
      email: Yup.string()
        .email()
        .when('can_authorize', (can_authorize, field) =>
          can_authorize ? field.required() : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail.' });
    }

    const client = await Client.create(req.body);

    return res.status(201).json(client);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      register: Yup.number()
        .integer()
        .positive(),
      company_id: Yup.string(),
      occupation_id: Yup.string(),
      can_authorize: Yup.boolean().default(false),
      email: Yup.string()
        .email()
        .when('can_authorize', (can_authorize, field) =>
          can_authorize ? field.required() : field
        ),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(400).json({
        error: 'Client not found.',
      });
    }

    await client.update(req.body);

    return res.json(client);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(400).json({
        error: 'Client not found.',
      });
    }

    await client.destroy();

    return res.status(204).json();
  }
}

export default new ClientController();
