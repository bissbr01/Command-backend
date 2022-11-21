const bcrypt = require('bcrypt')
const router = require('express').Router()
const {
  User,
  Project,
  Sprint,
  Issue,
  Team,
  Notification,
} = require('../models')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {
  sgMail,
  colleagueRequestEmail,
  issueAssignEmail,
} = require('../util/sendEmail')
const { RouteErrors } = require('../util/errorHandler')

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
  if (!users) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(users)
})

router.get('/me', async (req, res) => {
  const user = await User.findByPk(req.auth.id, {
    include: [
      Project,
      {
        model: Notification,
        include: ['colleague'],
      },
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
  if (!user) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(user)
})

router.post('/', async (req, res) => {
  // use id_token from req.body to get user info from auth0
  const cert = fs.readFileSync('dev-w8p6njku.pem')
  const decodedToken = jwt.verify(req.body.token, cert)

  // find or add to db.  This syncs local database users with auth0 user store
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
  if (!user) throw Error(RouteErrors.IMPROPER_FORMAT.key)
  res.json({ user, created })
})

router.get('/me/notifications', async (req, res) => {
  const notifications = await Notification.findAll({
    where: {
      userId: req.auth.id,
    },
  })
  if (!notifications) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(notifications)
})

router.post('/me/colleagues', async (req, res) => {
  const user = await User.findByPk(req.auth.id)
  if (!user) throw Error(RouteErrors.IMPROPER_FORMAT.key)
  const colleague = await User.findOne({ where: { email: req.body.email } })
  if (!colleague) throw Error(RouteErrors.COLLEAGUE_DOESNT_EXIST.key)
  await colleague.addFriend(user)
  const result = await user.addFriend(colleague)

  const notification = await Notification.create({
    type: Notification.types.colleagueConfirmed,
    userId: colleague.id,
    colleagueId: user.id,
  })

  res.json({ result })
})

router.delete('/me/colleagues/:id', async (req, res) => {
  const user = await User.findByPk(req.auth.id)
  if (!user) throw Error(RouteErrors.IMPROPER_FORMAT.key)
  const colleague = await User.findByPk(req.params.id)
  if (!colleague) throw Error(RouteErrors.IMPROPER_FORMAT.key)
  const result = await user.removeFriend(colleague)

  res.json({ result })
})

router.patch('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) throw Error(RouteErrors.NOT_FOUND.key)
  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (user[attr] = req.body[attr]))
  await user.save()
  res.json(user)
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) throw Error(RouteErrors.NOT_FOUND.key)
  const result = await user.destroy()
  if (!result) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.status(200).json({ result })
})

module.exports = router
