const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('issues', 'story_points', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('issues', 'story_points')
}

module.exports = { up, down }
