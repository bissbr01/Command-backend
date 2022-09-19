const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Project, Sprint, Issue } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: Project,
  })
  res.json(users)
})

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  // if (!req.oidc.isAuthenticated()) {
  //   throw new Error('You must be authenticated to perform this action.');
  // }
  try {
    const saltRounds = 8
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user = await User.create({ ...req.body, password: passwordHash })
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/me', async (req, res) => {
  const user = await User.findByPk(req.auth.id, {
    include: [
      Project,
      Sprint,
      { model: Issue, as: 'authoredIssues' },
      { model: Issue, as: 'assignedIssues' },
    ],
  })
  if (!user) throw new Error('Resource not found')
  res.json(user)
})

router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) throw new Error('Resource not found')
    const attributes = Object.keys(req.body)
    attributes.forEach((attr) => (user[attr] = req.body[attr]))
    await user.save()
    res.json(user)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) throw new Error('Resource not found')
    const result = await user.destroy()
    if (!result) throw new Error('Unable to perform operation')
    res.status(200).json({ result })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
