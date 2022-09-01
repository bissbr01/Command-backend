const User = require('./user');
const Issue = require('./issue');
const Comment = require('./comment');
const Sprint = require('./sprint');
const Project = require('./project');

Project.hasMany(Sprint);
Sprint.belongsTo(Project);

Sprint.hasMany(Issue);
Issue.belongsTo(Sprint);

Issue.hasMany(Comment);
Comment.belongsTo(Issue);

User.hasMany(Comment, { foreignKey: 'authorId' });
Comment.belongsTo(User, { as: 'author' });

User.hasMany(Issue, { foreignKey: 'authorId' });
Issue.belongsTo(User, { as: 'author' });
User.hasMany(Issue, { foreignKey: 'assigneeId' });
Issue.belongsTo(User, { as: 'assignee' });

User.hasMany(Sprint, { foreignKey: 'authorId' });
Sprint.belongsTo(User, { as: 'author' });

User.hasMany(Project, { foreignKey: 'authorId' });
Project.belongsTo(User, { as: 'author' });

module.exports = {
  User,
  Issue,
  Comment,
  Sprint,
  Project,
};
