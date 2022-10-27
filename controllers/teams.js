const { Op } = require('sequelize')
const router = require('express').Router()

const { User, Team, Project } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({
    include: [User, Project],
  })
  if (!teams) throw Error('Resource not found')
  res.json(teams)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const team = await Team.findByPk(req.params.id, {
    include: [User, Project],
  })
  if (!team) throw Error('Resource not found')
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

  if (!team) throw Error('Unable to perform operation')
  res.json(team)
})

router.patch('/:id', async (req, res) => {
  const team = await Team.findByPk(req.params.id, {
    include: [Project, User],
  })
  if (!team) throw Error('Resource not found')

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
  if (!team) throw Error('Resource not found')

  const projects = await Project.findAll({
    where: { id: team.projects.map((project) => project.id) },
    include: [Team],
  })
  const promises = projects.map((project) => project.setTeam(null))
  console.log('promises', promises)
  await Promise.all(promises)

  const result = await team.destroy()
  if (!result) throw Error('Unable to perform operation')
  res.status(200).json({ success: true, id: team.id })
})

module.exports = router
