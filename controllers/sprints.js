const { Op } = require('sequelize')
const router = require('express').Router()

const { Sprint, Issue } = require('../models')

router.get('/', async (req, res) => {
  const sprints = await Sprint.findAll({
    include: 'author',
  })
  if (!sprints) throw Error('Resource not found')
  res.json(sprints)
})

router.get('/active', async (req, res) => {
  const sprint = await Sprint.findOne({
    where: {
      [Op.and]: [{ authorId: req.auth.id }, { active: true }],
    },
    include: [
      { model: Issue, include: ['author'], order: [['createdAt', 'ASC']] },
    ],
  })
  if (!sprint) throw Error('Resource not found')
  res.json(sprint)
})

router.post('/', async (req, res) => {
  const sprints = await Sprint.create(req.body)
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
