const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Project, Sprint, Issue, Team } = require('../models')
const jwt = require('jsonwebtoken')
const fs = require('fs')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      Project,
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: [],
        },
      },
    ],
  })
  if (!users) throw Error('Resource not found')
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    // use id_token from req.body to get user info from auth0
    const cert = fs.readFileSync('dev-w8p6njku.pem')
    const decodedToken = jwt.verify(req.body.token, cert)

    console.log(decodedToken)
    // find or add to db
    const { nickname, name, picture, email, email_verified, sub } = decodedToken
    const [user, created] = await User.findOrCreate({
      where: {
        id: sub,
        nickname,
        name,
        picture,
        email,
        emailVerified: email_verified,
      },
    })
    if (!user) throw Error('Your request is improperly formatted')
    res.json({ user, created })
  } catch (error) {
    console.log('err.name', error.name)
    console.log('err.message', error.message)
    console.log('err.errors', error.errors)
    return res.status(400).json({ error: error.message })
  }
})

router.get('/me', async (req, res) => {
  try {
    const user = await User.findByPk(req.auth.sub, {
      include: [
        Project,
        {
          model: Team,
          attributes: ['name', 'id'],
          through: {
            attributes: [],
          },
          include: {
            model: User,
            attributes: ['name', 'email'],
            through: {
              attributes: [],
            },
          },
        },
        // { model: Issue, as: 'authoredIssues' },
        // { model: Issue, as: 'assignedIssues' },
      ],
    })
    if (!user) throw Error('Resource not found')
    res.json(user)
  } catch (error) {
    console.log('err.name', error.name)
    console.log('err.message', error.message)
    console.log('err.errors', error.errors)
    return res.status(400).json({ error: error.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) throw Error('Resource not found')
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
    if (!user) throw Error('Resource not found')
    const result = await user.destroy()
    if (!result) throw Error('Unable to perform operation')
    res.status(200).json({ result })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
