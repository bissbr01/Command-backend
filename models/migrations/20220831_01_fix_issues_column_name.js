const { DataTypes } = require('sequelize');

const up = async ({ context: queryInterface }) => {
  queryInterface.sequelize.transaction(async (transaction) => {
    // await queryInterface.removeConstraint('my_some_table', 'my_constraint', {
    //   transaction,
    // });
    await queryInterface.renameColumn(
      'issues',
      'attachmentURI',
      'attachment_uri',
      {
        transaction,
      }
    );
    // await queryInterface.addConstraint('my_some_table', ['toto_id'], {
    //   type: 'unique',
    //   name: 'my_constraint',
    //   transaction,
    // });
  });
};

const down = async ({ context: queryInterface }) => {
  queryInterface.sequelize.transaction(async (transaction) => {
    // await queryInterface.removeConstraint('my_some_table', 'my_constraint', {
    //   transaction,
    // });
    await queryInterface.renameColumn(
      'issues',
      'attachment_uri',
      'attachmentURI',
      {
        transaction,
      }
    );
    // await queryInterface.addConstraint('my_some_table', ['toto_id'], {
    //   type: 'unique',
    //   name: 'my_constraint',
    //   transaction,
    // });
  });
};

module.exports = { up, down };
