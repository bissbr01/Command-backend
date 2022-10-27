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

router.get('/me', async (req, res) => {
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
          attributes: ['name', 'email', 'picture', 'id'],
          through: {
            attributes: [],
          },
        },
      },
      {
        model: User,
        as: 'friends',
        through: {
          attributes: [],
        },
      },
    ],
  })
  if (!user) throw Error('Resource not found')
  res.json(user)
})

router.post('/', async (req, res) => {
  // use id_token from req.body to get user info from auth0
  const cert = fs.readFileSync('dev-w8p6njku.pem')
  const decodedToken = jwt.verify(req.body.token, cert)

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
})

router.post('/me/colleagues', async (req, res) => {
  const user = await User.findByPk(req.auth.id)
  if (!user) throw Error('Your request is improperly formatted')
  const friend = await User.findOne({ where: { email: req.body.email } })
  if (!friend)
    throw Error('This user is not in the system, so they cannot be added.')
  const result = await user.addFriend(friend)

  res.json({ result })
})

router.delete('/me/colleagues/:id', async (req, res) => {
  const user = await User.findByPk(req.auth.id)
  if (!user) throw Error('Your request is improperly formatted')
  const friend = await User.findByPk(req.params.id)
  if (!friend) throw Error('Your request is improperly formatted')
  const result = await user.removeFriend(friend)

  res.json({ result })
})

router.patch('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) throw Error('Resource not found')
  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (user[attr] = req.body[attr]))
  await user.save()
  res.json(user)
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) throw Error('Resource not found')
  const result = await user.destroy()
  if (!result) throw Error('Unable to perform operation')
  res.status(200).json({ result })
})

module.exports = router
