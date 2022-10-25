const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('colleagues', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    friend_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  })
}

const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('colleagues')
}

module.exports = { up, down }
