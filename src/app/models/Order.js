import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        status: Sequelize.ENUM('opened', 'pending', 'closeded'),
        has_occurrency: Sequelize.BOOLEAN,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items',
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.belongsTo(models.Client, {
      foreignKey: 'client_id',
      as: 'client',
    });
    this.belongsTo(models.Client, {
      foreignKey: 'authorizing_client_id',
      as: 'client_authorizing',
    });
  }
}

export default Order;
