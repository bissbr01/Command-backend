const { Op } = require('sequelize')
const router = require('express').Router()

const { User, Team } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({
    // where: {
    //   '$users.id$': req.auth.id,
    // },
    include: {
      model: User,
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
      through: {
        attributes: ['userId', 'teamId', 'id'],
      },
      where: {
        id: req.auth.id,
      },
      required: false,
      right: true,
    },
  })
  if (!teams) throw Error('Resource not found')
  res.json(teams)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const team = await Team.findByPk(req.params.id, {
    // where: {
    //   [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }],
    // },
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
    const team = await Team.findByPk(req.params.id)
    if (!team) throw Error('Resource not found')
    const result = await team.destroy()
    if (!result) throw Error('Unable to perform operation')
    res.status(200).json({ result })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
