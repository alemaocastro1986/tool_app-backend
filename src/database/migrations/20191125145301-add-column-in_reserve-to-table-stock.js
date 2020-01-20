module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('stocks', 'in_reserve', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('stocks', 'in_reserve', {});
  },
};
