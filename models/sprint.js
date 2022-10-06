const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Sprint extends Model {}

Sprint.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    length: {
      type: DataTypes.INTEGER,
      defaultValue: 14,
    },
    end: {
      type: DataTypes.VIRTUAL,
      get() {
        // return end date in milliseconds
        const end =
          new Date(this.startOn).getTime() + this.length * 1000 * 60 * 60 * 24
        return end
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'sprint',
  }
)

module.exports = Sprint
