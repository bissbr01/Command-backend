const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    modelName: 'project',
  }
);

module.exports = Project;
