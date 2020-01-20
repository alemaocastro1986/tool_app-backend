import Sequelize, { Model } from 'sequelize';
import { hash, compare } from 'bcryptjs';

import authConfig from '../../config/auth';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        is_admin: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await hash(user.password, authConfig.salt);
      }
    });

    return this;
  }

  checkPassword(password) {
    return compare(password, this.password_hash);
  }
}

export default User;
