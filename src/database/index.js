import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Company from '../app/models/Company';
import Occupation from '../app/models/Occupation';
import Client from '../app/models/Client';
import Tool from '../app/models/Tool';
import Stock from '../app/models/Stock';
import Order from '../app/models/Order';
import OrderItem from '../app/models/OrderItem';

const models = [
  User,
  Company,
  Occupation,
  Client,
  Tool,
  Stock,
  Order,
  OrderItem,
];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
  }

  init() {
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
