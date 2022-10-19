const { Op } = require('sequelize')
const router = require('express').Router()

const { User, Team, Membership } = require('../models')

router.get('/', async (req, res) => {
  const membership = await Membership.findAll({})
  if (!membership) throw Error('Resource not found')
  res.json(membership)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const membership = await Membership.findByPk(req.params.id, {
    // where: {
    //   [Op.or]: [{ authorId: req.auth.id }, { assigneeId: req.auth.id }],
    // },
  })
  if (!membership) throw Error('Resource not found')
  res.json(membership)
})

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const membership = await Membership.create({
    userId: req.body.userId,
    teamId: req.body.teamId,
  })
  if (!membership) throw Error('Unable to perform operation')
  res.json(membership)
})

router.patch('/:id', async (req, res) => {
  const membership = await Membership.findByPk(req.params.id)
  if (!membership) throw Error('Resource not found')
  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (membership[attr] = req.body[attr]))
  await membership.save()
  res.json(membership)
})

router.delete('/:id', async (req, res) => {
  const membership = await Membership.findByPk(req.params.id)
  if (!membership) throw Error('Resource not found')
  const result = await membership.destroy()
  if (!result) throw Error('Unable to perform operation')
  res.status(200).json({ result })
})

module.exports = router
