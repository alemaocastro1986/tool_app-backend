module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('clients', 'email', {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('clients', 'email');
  },
};
