const router = require('express').Router()

const { Op } = require('sequelize')
const { Project, Sprint, Team, User } = require('../models')
const { RouteErrors } = require('../util/errorHandler')

router.get('/', async (req, res) => {
  const me = await User.findByPk(req.auth.id, {
    include: [
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: [],
        },
      },
    ],
  })
  if (!me) throw Error(RouteErrors.IMPROPER_FORMAT.key)

  const myTeamIds = me.teams.map((team) => team.id)

  const projects = await Project.findAll({
    where: {
      [Op.or]: [
        { leadId: req.auth.id },
        {
          teamId: {
            [Op.or]: myTeamIds,
          },
        },
      ],
    },
    include: [
      'lead',
      Sprint,
      {
        model: Team,
        include: {
          model: User,
        },
      },
    ],
  })
  if (!projects) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(projects)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const project = await Project.findByPk(req.params.id, {
    include: { model: User, as: 'lead' },
  })
  if (!project) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(project)
})

router.post('/', async (req, res) => {
  const project = await Project.create(
    {
      ...req.body,
      sprints: [
        {
          active: true,
          isBacklog: true,
          authorId: req.auth.id,
          goal: '',
        },
        {
          active: true,
          displayOnBoard: true,
          authorId: req.auth.id,
          goal: '',
        },
      ],
    },
    {
      include: [Sprint, Team],
    }
  )

  // manually set each sprint name field
  const projectSprints = await Sprint.findAll({
    where: { projectId: project.id },
  })
  projectSprints.forEach(async (sprint, index) => {
    sprint.isBacklog
      ? (sprint.name = 'Backlog')
      : sprint.setNameField(project.title, index)
    await sprint.save()
  })

  if (!project) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.json(project.toJSON())
})

router.patch('/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id)
  if (!project) throw Error(RouteErrors.NOT_FOUND.key)
  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (project[attr] = req.body[attr]))
  await project.save()
  res.json(project)
})

router.delete('/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id)
  if (!project) throw Error(RouteErrors.NOT_FOUND.key)
  const result = await project.destroy()
  if (!result) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.status(200).json({ result })
})

module.exports = router
