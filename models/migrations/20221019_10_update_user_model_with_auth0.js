const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    await queryInterface.removeColumn('users', 'first_name', { transaction })
    await queryInterface.removeColumn('users', 'last_name', { transaction })
    await queryInterface.removeColumn('users', 'password', { transaction })
    await queryInterface.addColumn(
      'users',
      'name',
      {
        type: DataTypes.TEXT,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'users',
      'nickname',
      {
        type: DataTypes.TEXT,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'users',
      'email_verified',
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'users',
      'picture',
      {
        type: DataTypes.TEXT,
      },
      { transaction }
    )
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const down = async ({ context: queryInterface }) => {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    await queryInterface.addColumn(
      'users',
      'first_name',
      {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'users',
      'last_name',
      {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'users',
      'password',
      {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      { transaction }
    )
    await queryInterface.removeColumn('users', 'email_verified', {
      transaction,
    })
    await queryInterface.removeColumn('users', 'picture', { transaction })
    await queryInterface.removeColumn('users', 'name', { transaction })
    await queryInterface.removeColumn('users', 'nickname', { transaction })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = { up, down }
