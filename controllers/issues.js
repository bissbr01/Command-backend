const { Op, fn, col } = require('sequelize')
const { Issue, User, Sprint, Comment, Project } = require('../models')
const router = require('express').Router()
const { RouteErrors } = require('../util/errorHandler')

router.get('/', async (req, res) => {
  let where = {}
  const issues = await Issue.findAll({
    include: 'author',
    where,
  })
  if (!issues) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(issues)
})

router.get('/backlog', async (req, res) => {
  const issues = await Issue.findAll({
    where: {
      [Op.and]: [
        { sprintId: { [Op.is]: null } },
        { '$sprint.projectId$': req.query.projectId },
        // { [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }] },
      ],
    },
    include: [
      { model: User, as: 'author' },
      { model: User, as: 'assignee' },
    ],
    order: [['boardOrder', 'ASC']],
  })
  if (!issues) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(issues)
})

router.get('/me', async (req, res) => {
  const issues = await Issue.findAll({
    where: {
      [Op.and]: [
        { '$sprint.active$': true },
        { [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }] },
      ],
    },
    include: [
      { model: Sprint },
      { model: User, as: 'author' },
      { model: User, as: 'assignee' },
    ],
    order: [['boardOrder', 'ASC']],
  })
  if (!issues) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(issues)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error(RouteErrors.IMPROPER_FORMAT.key)
  }
  const issue = await Issue.findByPk(req.params.id, {
    where: {
      [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }],
    },
    include: [
      Sprint,
      { model: User, as: 'author' },
      { model: User, as: 'assignee' },
      { model: Comment, include: ['author'], order: [['createdAt', 'DESC']] },
    ],
  })
  if (!issue) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(issue)
})

router.post('/', async (req, res) => {
  const issue = await Issue.create({ ...req.body, authorId: req.auth.id })

  // set issue name field by getting Sprint Issue count and name:
  const project = await Project.findByPk(req.body.projectId, {
    attributes: {
      include: ['title', [fn('COUNT', col('sprints.issues.id')), 'issueCount']],
    },
    include: [
      {
        model: Sprint,
        attributes: [],
        include: {
          model: Issue,
          attributes: [],
        },
      },
    ],
    group: ['project.id'],
    raw: true,
  })

  issue.setNameField(project.title, project.issueCount)
  await issue.save()

  return res.json(project)
})

router.patch('/:id', async (req, res) => {
  const issue = await Issue.findByPk(req.params.id)
  if (!issue) throw Error(RouteErrors.NOT_FOUND.key)

  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (issue[attr] = req.body[attr]))
  await issue.save()
  res.json(issue)
})

router.delete('/:id', async (req, res) => {
  const issue = await Issue.findByPk(req.params.id)
  if (!issue) throw Error(RouteErrors.NOT_FOUND.key)

  if (req.auth.id !== issue.authorId) {
    throw Error('You do not have permission to perform this action')
  }

  const result = await issue.destroy()
  if (!result) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.status(200).json({ success: true, id: issue.id })
})

module.exports = router
