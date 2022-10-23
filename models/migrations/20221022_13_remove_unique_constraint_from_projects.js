const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('projects', 'title', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('projects', 'title', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
}

module.exports = { up, down }
