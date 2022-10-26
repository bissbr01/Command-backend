const { Op } = require('sequelize')
const router = require('express').Router()

const { User, Team, Project } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({
    // where: {
    //   '$users.id$': req.auth.id,
    // },
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
  try {
    const team = await Team.create({
      name: req.body.name,
    })

    console.log('team: ', team)

    const me = await User.findByPk(req.auth.id)
    console.log('me: ', me)

    await team.addUser(me)

    const users = await User.findAll({ where: { id: req.body.userIds } })
    await team.addUsers(users)

    if (!team) throw Error('Unable to perform operation')
    res.json(team)
  } catch (error) {
    console.log('err.name', error.name)
    console.log('err.message', error.message)
    res.status(400).json({ error })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id)
    if (!team) throw Error('Resource not found')
    const attributes = Object.keys(req.body)
    attributes.forEach((attr) => (team[attr] = req.body[attr]))
    await team.save()
    res.json(team)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
})

module.exports = router
