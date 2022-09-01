const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Issue extends Model {}
Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['backlog', 'todo', 'inProgress', 'done']],
      },
      defaultValue: 'todo',
    },
    attachmentUri: {
      type: DataTypes.STRING,
      isUrl: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    title: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['userStory', 'bug', 'task']],
      },
      defaultValue: 'userStory',
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    sprintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sprints',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'issue',
  }
);

module.exports = Issue;
