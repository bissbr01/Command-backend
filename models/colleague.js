const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')
const User = require('./user')

class Colleague extends Model {}

Colleague.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.VIRTUAL,
      get() {
        return `Colleague ${this.id}`
      },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    friendId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'colleague',
  }
)

module.exports = Colleague
