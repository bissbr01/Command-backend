const { Op } = require('sequelize')
const router = require('express').Router()
const { RouteErrors } = require('../util/errorHandler')

const { User, Team, Project } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({
    include: [User, Project],
  })
  if (!teams) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(teams)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error(RouteErrors.IMPROPER_FORMAT.key)
  }
  const team = await Team.findByPk(req.params.id, {
    include: [User, Project],
  })
  if (!team) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(team)
})

router.post('/', async (req, res) => {
  const team = await Team.create({
    name: req.body.name,
  })

  const me = await User.findByPk(req.auth.id)
  await team.addUser(me)

  const users = await User.findAll({ where: { id: req.body.userIds } })
  await team.addUsers(users)

  if (!team) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.json(team)
})

router.patch('/:id', async (req, res) => {
  const team = await Team.findByPk(req.params.id, {
    include: [Project, User],
  })
  if (!team) throw Error(RouteErrors.NOT_FOUND.key)

  if (req.body.name) {
    team.name = req.body.name
  }

  if (req.body.projectIds) {
    const projects = await Project.findAll({
      where: { id: req.body.projectIds },
    })
    await team.setProjects(projects)
  }

  if (req.body.userIds) {
    const users = await User.findAll({ where: { id: req.body.userIds } })
    await team.setUsers(users)
  }

  await team.save()
  res.json(team)
})

router.delete('/:id', async (req, res) => {
  const team = await Team.findByPk(req.params.id, {
    include: [Project],
  })
  if (!team) throw Error(RouteErrors.NOT_FOUND.key)

  const projects = await Project.findAll({
    where: { id: team.projects.map((project) => project.id) },
    include: [Team],
  })
  const promises = projects.map((project) => project.setTeam(null))
  await Promise.all(promises)

  const result = await team.destroy()
  if (!result) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.status(200).json({ success: true, id: team.id })
})

module.exports = router
