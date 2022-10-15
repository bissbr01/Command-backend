const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('sprints', 'display_on_board', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('sprints', 'display_on_board')
}

module.exports = { up, down }
