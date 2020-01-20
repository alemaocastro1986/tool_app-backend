import Sequelize, { Model } from 'sequelize';

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        quantity: Sequelize.INTEGER,
        quantity_returned: Sequelize.INTEGER,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });

    this.belongsTo(models.Tool, {
      foreignKey: 'tool_id',
      as: 'tool',
    });
  }
}

export default OrderItem;
