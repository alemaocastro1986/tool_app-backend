import Sequelize, { Model } from 'sequelize';

class Occupation extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

export default Occupation;
