const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('issues', 'board_order', {
    type: DataTypes.INTEGER,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('issues', 'board_order')
}

module.exports = { up, down }
