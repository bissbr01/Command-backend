const { Op } = require('sequelize')
const { Issue, User, Sprint, Comment } = require('../models')
const router = require('express').Router()

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ],
    }
  }
  const issues = await Issue.findAll({
    // attributes: { exclude: ['userId'] },
    include: 'author',
    where,
    // order: [['likes', 'DESC']],
  })
  if (!issues) throw Error('Resource not found')
  res.json(issues)
})

router.get('/me', async (req, res) => {
  const issues = await Issue.findAll({
    where: {
      [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }],
    },
    include: [
      Sprint,
      { model: User, as: 'author' },
      { model: User, as: 'assignee' },
    ],
    order: [['boardOrder', 'ASC']],
  })
  if (!issues) throw Error('Resource not found')
  res.json(issues)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
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
  if (!issue) throw Error('Resource not found')
  res.json(issue)
})

router.post('/', async (req, res) => {
  try {
    const issue = await Issue.create({ ...req.body, authorId: req.auth.id })

    return res.json(issue)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.patch('/me', async (req, res) => {
  // req.body = { issues: Issue[] } to all be patched
  if (!'issues' in req.body || !Array.isArray(req.body.issues)) {
    throw Error('Your request is improperly formatted')
  }
  const { issues: reqIssues } = req.body
  console.log('req Issues: ', reqIssues)
  let result = []
  try {
    reqIssues.forEach(async (reqIssue) => {
      const patchIssue = await Issue.findByPk(reqIssue?.id)
      if (!patchIssue) throw Error('Resource not found')
      const keys = Object.keys(reqIssue)
      keys.forEach((key) => (patchIssue[key] = reqIssue[key]))
      await patchIssue.save()
    })

    res.json({})
  } catch (error) {
    console.log(error)
  }
})
router.patch('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id)
    if (!issue) throw Error('Resource not found')

    const attributes = Object.keys(req.body)
    attributes.forEach((attr) => (issue[attr] = req.body[attr]))
    await issue.save()
    res.json(issue)
  } catch (error) {
    console.log(error)
  }
})

router.delete('/:id', async (req, res) => {
  const issue = await Issue.findByPk(req.params.id)
  if (!issue) throw Error('Resource not found')

  if (req.auth.id !== issue.authorId) {
    throw Error('You do not have permission to perform this action')
  }

  const result = await issue.destroy()
  if (!result) throw Error('Unable to perform operation')
  res.status(200).json({ success: true, id: issue.id })
})

module.exports = router
