const { Op } = require('sequelize')
const router = require('express').Router()

const { Sprint, Issue, User } = require('../models')

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        { goal: { [Op.iLike]: `%${req.query.search}%` } },
        { '$author.name$': { [Op.iLike]: `%${req.query.search}%` } },
      ],
    }
  }

  if (req.query.projectId) {
    where = {
      ...where,
      projectId: req.query.projectId,
    }
  }
  if (req.query.active) {
    where = {
      ...where,
      active: req.query.active,
    }
  }
  if (req.query.displayOnBoard) {
    where = {
      ...where,
      displayOnBoard: req.query.displayOnBoard,
    }
  }

  const sprints = await Sprint.findAll({
    [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }],
    include: [
      {
        model: Issue,
        include: ['author'],
        order: [['createdAt', 'ASC']],
      },
      'author',
    ],
    where,
    order: [['createdAt', 'ASC']],
  })
  if (!sprints) throw Error('Resource not found')
  res.json(sprints)
})

router.get('/board', async (req, res) => {
  console.log('body: ', req.body)
  const sprints = await Sprint.findOne({
    where: {
      authorId: req.auth.id,
      displayOnBoard: true,
      projectId: req.query.projectId,
    },
    include: [
      {
        model: Issue,
        include: ['author'],
        order: [['createdAt', 'ASC']],
      },
    ],
  })
  if (!sprints) throw Error('Resource not found')
  res.json(sprints)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const sprint = await Sprint.findByPk(req.params.id, {
    where: {
      [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }],
    },
    include: [{ model: User, as: 'author' }, { model: Issue }],
  })
  if (!sprint) throw Error('Resource not found')
  res.json(sprint)
})

router.post('/', async (req, res) => {
  const sprints = await Sprint.create({
    ...req.body,
    authorId: req.auth.id,
    projectId: req.body.projectId,
  })
  if (!sprints) throw Error('Unable to perform operation')
  res.json(sprints)
})

router.patch('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.id)
    if (!sprint) throw Error('Resource not found')
    const attributes = Object.keys(req.body)
    attributes.forEach((attr) => (sprint[attr] = req.body[attr]))
    await sprint.save()
    res.json(sprint)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.id)
    if (!sprint) throw Error('Resource not found')
    const result = await sprint.destroy()
    if (!result) throw Error('Unable to perform operation')
    res.status(200).json({ result })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
