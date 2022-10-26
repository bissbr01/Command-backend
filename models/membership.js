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
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: User, key: 'id' },
      onDelete: 'CASCADE',
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Team, key: 'id' },
      onDelete: 'CASCADE',
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
