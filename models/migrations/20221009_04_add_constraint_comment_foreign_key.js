const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  // await queryInterface.addConstraint('comments', {
  //   type: 'foreign key',
  //   name: 'fk_comments_users',
  //   fields: ['author_id'],
  //   references: {
  //     table: 'users',
  //     field: 'id',
  //   },
  //   onDelete: 'cascade',
  //   onUpdate: 'cascade',
  // })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.removeConstraint('comments', 'fk_comments_users')
}

module.exports = { up, down }
