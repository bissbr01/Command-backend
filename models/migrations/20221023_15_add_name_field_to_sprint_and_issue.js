const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    await queryInterface.addColumn(
      'sprints',
      'name',
      {
        type: DataTypes.TEXT,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'issues',
      'name',
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
    await queryInterface.removeColumn('sprints', 'name', {
      transaction,
    })
    await queryInterface.removeColumn('issues', 'name', { transaction })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = { up, down }
