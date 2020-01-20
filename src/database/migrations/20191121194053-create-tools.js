module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tools', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      description: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      is_restricted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('tools');
  },
};
