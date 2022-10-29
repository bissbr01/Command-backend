const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Sprint extends Model {
  setNameField(projectTitle, projectSprintsCount) {
    const words = projectTitle.split(' ')
    const firstLetters = words
      .map((word) => word[0])
      .join('')
      .toUpperCase()

    this.setDataValue('name', `${firstLetters} Sprint ${projectSprintsCount}`)
  }
}

Sprint.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.VIRTUAL,
      get() {
        return `Sprint ${this.name}`
      },
    },
    goal: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
    startOn: {
      type: DataTypes.DATE,
    },
    endOn: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    displayOnBoard: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isBacklog: {
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
      type: DataTypes.STRING,
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
