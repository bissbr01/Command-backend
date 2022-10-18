const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((t) => {
    return Promise.all([
      queryInterface.changeColumn(
        'sprints',
        'end_on',
        {
          type: DataTypes.DATE,
          defaultValue: null,
          allowNull: true,
        },
        { transation: t }
      ),
      queryInterface.changeColumn(
        'sprints',
        'start_on',
        {
          type: DataTypes.DATE,
          defaultValue: null,
          allowNull: true,
        },
        { transation: t }
      ),
    ])
  })
}

const down = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((t) => {
    return Promise.all([
      queryInterface.changeColumn(
        'sprints',
        'end_on',
        {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        { transation: t }
      ),
      queryInterface.changeColumn(
        'sprints',
        'start_on',
        {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        { transation: t }
      ),
    ])
  })
}

module.exports = { up, down }
