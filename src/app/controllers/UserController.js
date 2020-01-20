import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'is_admin',
        'created_at',
        'updated_at',
      ],
      order: ['created_at'],
    });

    return res.json(users);
  }
  
   async show(req, res) {
    const user = await User.findByPk(req.params.id,{
      attributes: [
        'id',
        'name',
        'email',
        'is_admin',
        'created_at',
        'updated_at',
      ],
    });

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(150)
        .min(5)
        .required(),
      email: Yup.string(150)
        .email()
        .required(),
      password: Yup.string()
        .min(5)
        .max(10)
        .required(),
      is_admin: Yup.boolean().default(false),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { id, name, email, is_admin } = await User.create(req.body);

    return res.json({ id, name, email, is_admin });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(150).min(5),
      email: Yup.string(150).email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      is_admin: Yup.boolean().default(false),
    });
	
	


    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }
	
	const { email, oldPassword } = req.body;
	
	const id = req.params.id || req.userId;
	
	const user = await User.findByPk(id);
	
	if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
	
    if (email && user.email !== email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          error: 'User already exists',
        });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

       

    const {  name,  is_admin } = await user.update(req.body);

    return res.json({ id, name, email, is_admin });
  }

  async destroy(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    await user.destroy();

    return res.status(204).json();
  }
}

export default new UserController();
