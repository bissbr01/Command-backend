const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'sub', {
    type: DataTypes.STRING,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('users', 'sub')
}

module.exports = { up, down }
