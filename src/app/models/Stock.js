import Sequelize, { Model } from 'sequelize';

class Stock extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        quantity: Sequelize.INTEGER,
        in_reserve: Sequelize.INTEGER,
        available: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.quantity - this.in_reserve;
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Tool, {
      foreignKey: 'tool_id',
      as: 'tool',
    });
  }

  addReserve(quantity) {
    this.in_reserve += quantity;
  }

  removeReserve(quantity) {
    this.in_reserve -= quantity;
  }
}

export default Stock;
