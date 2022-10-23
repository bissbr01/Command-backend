const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('sprints', 'is_backlog', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('sprints', 'is_backlog')
}

module.exports = { up, down }
