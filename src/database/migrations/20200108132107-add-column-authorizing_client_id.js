module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'authorizing_client_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('orders', 'authorizing_client_id');
  },
};
