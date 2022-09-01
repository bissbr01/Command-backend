const User = require('./user');
const Issue = require('./issue');
const Comment = require('./comment');
const Sprint = require('./sprint');
const Project = require('./project');

// Issue.hasMany(Comment);
// Comment.belongsTo(Issue);

// Sprint.hasMany(Issue);
// Issue.belongsTo(Comment);

// Project.hasMany(Sprint);
// Sprint.belongsTo(Project);

// User.hasMany(Comment);
// Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

// User.hasMany(Issue);
// Issue.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
// User.hasMany(Issue);
// Issue.belongsTo(User, { as: 'assignee', foreignKey: 'authorId' });

// User.hasMany(Sprint);
// Sprint.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

User.hasMany(Project, {
  foreignKey: {
    name: 'authorId', // the JavaScript attribute name
    field: 'author_id', // the column name
  },
});
Project.belongsTo(User, {
  as: 'author',
});

module.exports = {
  User,
  Issue,
  Comment,
  Sprint,
  Project,
};
