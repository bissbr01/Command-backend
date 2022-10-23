const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn('projects', 'author_id', 'lead_id')
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn('projects', 'lead_id', 'author_id')
}

module.exports = { up, down }
