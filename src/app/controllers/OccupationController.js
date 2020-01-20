import * as Yup from 'yup';
import Occupation from '../models/Occupation';

class OccupationController {
  async index(req, res) {
    const occupations = await Occupation.findAll();

    return res.json(occupations);
  }

  async store(req, res) {
    const schema = Yup.string()
      .min(10)
      .max(150)
      .required();

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation Fails',
      });
    }

    const occupation = await Occupation.create(req.body);

    return res.status(201).json(occupation);
  }

  async update(req, res) {
    const schema = Yup.string()
      .min(10)
      .max(150)
      .required();

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation Fails',
      });
    }

    const { id } = req.params;

    const occupation = await Occupation.findByPk(id);

    if (!occupation) {
      return res.status(400).json({
        error: 'Occupation not found',
      });
    }

    await occupation.update(req.body);

    return res.json(occupation);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const occupation = await Occupation.findByPk(id);

    if (!occupation) {
      return res.status(400).json({
        error: 'Occupation not found',
      });
    }

    await occupation.destroy();

    return res.status(204).json();
  }
}

export default new OccupationController();
