const { DataTypes } = require('sequelize')

const up = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((t) => {
    return Promise.all([
      queryInterface.addColumn(
        'sprints',
        'end_on',
        {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        { transation: t }
      ),
      queryInterface.removeColumn('sprints', 'length', {}, { transation: t }),
    ])
  })
}

const down = async ({ context: queryInterface }) => {
  return queryInterface.sequelize.transaction((t) => {
    return Promise.all([
      queryInterface.removeColumn('sprints', 'end_on', {}, { transation: t }),
      queryInterface.addColumn(
        'sprints',
        'length',
        {
          type: DataTypes.INTEGER,
          defaultValue: 14,
        },
        { transation: t }
      ),
    ])
  })
}

module.exports = { up, down }
