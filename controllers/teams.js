const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Project, Team } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({})
  res.json(teams)
})

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const team = await Team.create({
    name: req.body.name,
  })
  if (!team) throw Error('Unable to perform operation')
  res.json(team)
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
