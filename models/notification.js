const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Notification extends Model {
  static types = {
    colleageRequest: 'colleagueRequest',
    issueAssigned: 'issueAssigned',
  }
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    message: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'notification',
  }
)

module.exports = Notification
