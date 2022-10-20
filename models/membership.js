const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')
const Team = require('./team')
const User = require('./user')

class Membership extends Model {}

Membership.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Team, key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'membership',
  }
)

module.exports = Membership
