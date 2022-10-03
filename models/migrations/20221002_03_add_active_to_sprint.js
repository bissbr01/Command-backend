const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('sprints', 'active', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('sprints', 'active')
}

module.exports = { up, down }
