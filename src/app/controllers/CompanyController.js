import * as Yup from 'yup';
import Company from '../models/Company';

class CompanyController {
  async index(req, res) {
    const companies = await Company.findAll();

    return res.json(companies);
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

    const company = await Company.create(req.body);

    return res.status(201).json(company);
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

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(400).json({
        error: 'Company not found',
      });
    }

    await company.update(req.body);

    return res.json(company);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(400).json({
        error: 'Company not found',
      });
    }

    await company.destroy();

    return res.status(204).json();
  }
}

export default new CompanyController();
