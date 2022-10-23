const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('projects', 'team_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'teams',
      key: 'id',
    },
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('projects', 'team_id')
}

module.exports = { up, down }
