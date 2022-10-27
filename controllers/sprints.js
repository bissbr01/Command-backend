const { Op, fn, col } = require('sequelize')
const router = require('express').Router()
const { RouteErrors } = require('../util/errorHandler')

const { Sprint, Issue, User, Project } = require('../models')

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
  if (req.query.isBacklog) {
    where = {
      ...where,
      isBacklog: req.query.isBacklog,
    }
  }

  const sprints = await Sprint.findAll({
    include: [
      {
        model: Issue,
        include: ['author'],
        order: [['createdAt', 'ASC']],
      },
      'author',
    ],
    where,
    order: [['id', 'DESC']],
  })
  if (!sprints) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(sprints)
})

router.get('/board', async (req, res) => {
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
  if (!sprints) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(sprints)
})

router.get('/backlog', async (req, res) => {
  const [sprint, created] = await Sprint.findOrCreate({
    where: {
      projectId: req.query.projectId,
      isBacklog: true,
      authorId: req.auth.id,
    },
    include: [{ model: User, as: 'author' }, { model: Issue }],
  })
  if (!sprint) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(sprint)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const sprint = await Sprint.findByPk(req.params.id, {
    where: {
      authorId: req.auth.id,
    },
    include: [{ model: User, as: 'author' }, { model: Issue }],
  })
  if (!sprint) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(sprint)
})

router.post('/', async (req, res) => {
  const sprint = await Sprint.create({
    ...req.body,
    authorId: req.auth.id,
    projectId: req.body.projectId,
  })

  // set issue name field by getting Sprint Issue count and name:
  const project = await Project.findByPk(req.body.projectId, {
    attributes: {
      include: ['title', [fn('COUNT', col('sprints.id')), 'sprintCount']],
    },
    include: [
      {
        model: Sprint,
        attributes: [],
      },
    ],
    group: ['project.id'],
    raw: true,
  })

  sprint.setNameField(project.title, Number(project.sprintCount) - 1)
  await sprint.save()

  if (!sprint) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.json(sprint)
})

router.patch('/:id', async (req, res) => {
  const sprint = await Sprint.findByPk(req.params.id)
  if (!sprint) throw Error(RouteErrors.NOT_FOUND.key)
  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (sprint[attr] = req.body[attr]))
  await sprint.save()
  res.json(sprint)
})

router.delete('/:id', async (req, res) => {
  const sprint = await Sprint.findByPk(req.params.id)
  if (!sprint) throw Error(RouteErrors.NOT_FOUND.key)
  const result = await sprint.destroy()
  if (!result) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.status(200).json({ result })
})

module.exports = router
