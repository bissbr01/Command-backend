const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Notification extends Model {
  static types = {
    colleagueRequest: 'colleagueRequest',
    colleagueConfirmed: 'colleagueConfirmed',
    issueAssigned: 'issueAssigned',
  }
  static statuses = {
    alert: 'ALERT',
    read: 'READ',
    archive: 'ARCHIVE',
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
    colleagueId: {
      type: DataTypes.STRING,
      references: { model: 'users', key: 'id' },
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: { model: 'projects', key: 'id' },
    },
    message: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ALERT',
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
