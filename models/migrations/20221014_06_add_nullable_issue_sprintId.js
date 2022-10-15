const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('issues', 'sprint_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('issues', 'sprint_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
  })
}

module.exports = { up, down }
