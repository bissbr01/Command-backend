const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (t) => {
    await Promise.all([
      queryInterface.removeColumn('users', 'first_name', { transation: t }),
      queryInterface.removeColumn('users', 'last_name', { transation: t }),
      queryInterface.removeColumn('users', 'password', { transation: t }),
      queryInterface.addColumn(
        'users',
        'name',
        {
          type: DataTypes.TEXT,
        },
        { transaction: t }
      ),
      queryInterface.addColumn(
        'users',
        'nickname',
        {
          type: DataTypes.TEXT,
        },
        { transaction: t }
      ),
      queryInterface.addColumn(
        'users',
        'email_verified',
        {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        { transaction: t }
      ),
      queryInterface.addColumn(
        'users',
        'picture',
        {
          type: DataTypes.TEXT,
        },
        { transaction: t }
      ),
    ])
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (t) => {
    await Promise.all([
      queryInterface.addColumn(
        'users',
        'first_name',
        {
          type: DataTypes.STRING,
          // allowNull: false,
        },
        { transaction: t }
      ),
      queryInterface.addColumn(
        'users',
        'last_name',
        {
          type: DataTypes.STRING,
          // allowNull: false,
        },
        { transaction: t }
      ),
      queryInterface.addColumn(
        'users',
        'password',
        {
          type: DataTypes.STRING,
          // allowNull: false,
        },
        { transaction: t }
      ),
      queryInterface.removeColumn('users', 'email_verified', { transation: t }),
      queryInterface.removeColumn('users', 'picture', { transation: t }),
      queryInterface.removeColumn('users', 'name', { transation: t }),
      queryInterface.removeColumn('users', 'nickname', { transation: t }),
    ])
  })
}

module.exports = { up, down }
