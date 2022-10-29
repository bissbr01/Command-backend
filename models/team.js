const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.VIRTUAL,
      get() {
        return `Team ${this.name}`
      },
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'team',
  }
)

module.exports = Team
