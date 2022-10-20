const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'sid', {
    type: DataTypes.STRING,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('users', 'sid')
}

module.exports = { up, down }
