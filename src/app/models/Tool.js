import Sequelize, { Model } from 'sequelize';
import SequelizePaginate from 'sequelize-paginate';

class Tool extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        description: Sequelize.STRING,
        is_restricted: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    SequelizePaginate.paginate(this);

    return this;
  }

  static associate(models){
    this.hasOne(models.Stock, {
      foreignKey:'tool_id',
      as:'stock'
    })
  }
}

export default Tool;
