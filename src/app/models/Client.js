import Sequelize, { Model } from 'sequelize';

class Client extends Model {
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
        register: Sequelize.INTEGER,
        can_authorize: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company',
    });

    this.belongsTo(models.Occupation, {
      foreignKey: 'occupation_id',
      as: 'occupation',
    });
  }
}

export default Client;
