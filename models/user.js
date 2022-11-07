const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
    },
    identifier: {
      type: DataTypes.VIRTUAL,
      get() {
        return `User ${this.nickname}`
      },
    },
    nickname: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    picture: {
      type: DataTypes.TEXT,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
  }
)

module.exports = User
