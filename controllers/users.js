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
    const decodedToken = jwt.verify(req.body.idToken, cert)
    console.log('decoded token: ', decodedToken)

    // find or add to db
    const { nickname, name, picture, email, email_verified, sid } = decodedToken
    const [user, created] = await User.findOrCreate({
      where: {
        nickname,
        name,
        picture,
        email,
        sid,
        emailVerified: email_verified,
      },
    })
    if (!user) throw Error('Your request is improperly formatted')
    res.json({ user, created })
  } catch (error) {
    console.log('err.name', error.name)
    console.log('err.message', error.message)
    console.log('err.errors', error.errors)
    err.errors.map((e) => console.log(e.message)) // The name must contain between 2 and 100 characters.
    return res.status(400).json({ error: error.message })
  }
})

router.get('/me', async (req, res) => {
  const user = await User.findByPk(req.auth.id, {
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
          attributes: ['firstName', 'lastName', 'fullName', 'email'],
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
