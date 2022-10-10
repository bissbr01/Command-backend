const User = require('./user')
const Issue = require('./issue')
const Comment = require('./comment')
const Sprint = require('./sprint')
const Project = require('./project')

Project.hasMany(Sprint)
Sprint.belongsTo(Project)

Sprint.hasMany(Issue)
Issue.belongsTo(Sprint)

// for onDelete cascade to work, hooks must be set to true
Issue.hasMany(Comment, {
  onDelete: 'cascade',
  hooks: true,
})
Comment.belongsTo(Issue)

User.hasMany(Comment, { foreignKey: 'authorId' })
Comment.belongsTo(User, { as: 'author' })

User.hasMany(Issue, { as: 'authoredIssues', foreignKey: 'authorId' })
Issue.belongsTo(User, { as: 'author' })
User.hasMany(Issue, { as: 'assignedIssues', foreignKey: 'assigneeId' })
Issue.belongsTo(User, { as: 'assignee' })

User.hasMany(Sprint, { foreignKey: 'authorId' })
Sprint.belongsTo(User, { as: 'author' })

User.hasMany(Project, { foreignKey: 'authorId' })
Project.belongsTo(User, { as: 'author' })

module.exports = {
  User,
  Issue,
  Comment,
  Sprint,
  Project,
}
