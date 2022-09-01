const up = async ({ context: queryInterface }) => {
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.renameColumn('sprints', 'startOn', 'start_on', {
      transaction,
    });
  });
};

const down = async ({ context: queryInterface }) => {
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.renameColumn('sprints', 'start_on', 'startOn', {
      transaction,
    });
  });
};

module.exports = { up, down };
