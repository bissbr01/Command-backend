const User = require('./user')
const Issue = require('./issue')
const Comment = require('./comment')
const Sprint = require('./sprint')
const Project = require('./project')
const Team = require('./team')
const Membership = require('./membership')
const Colleague = require('./colleague')

Project.hasMany(Sprint, {
  onDelete: 'cascade',
  hooks: true,
})
Sprint.belongsTo(Project)

Sprint.hasMany(Issue, {
  onDelete: 'cascade',
  hooks: true,
})
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

User.hasMany(Project, { foreignKey: 'leadId' })
Project.belongsTo(User, { as: 'lead' })

Team.hasMany(Project)
Project.belongsTo(Team)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(User, { as: 'friends', through: Colleague })

module.exports = {
  User,
  Issue,
  Comment,
  Sprint,
  Project,
  Team,
  Membership,
  Colleague,
}
