const { hashSync } = require('bcryptjs');
const uuidv4 = require('uuid/v4');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          name: 'Adminstrator',
          email: 'admin@gpssa.com.br',
          password_hash: hashSync('Admin@123', 8),
          is_admin: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
