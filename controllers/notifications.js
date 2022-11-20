const router = require('express').Router()
const { User, Notification } = require('../models')
const {
  sgMail,
  colleagueRequestEmail,
  issueAssignEmail,
} = require('../util/sendEmail')
const { RouteErrors } = require('../util/errorHandler')

router.get('/', async (req, res) => {
  const notifications = await Notification.findAll({
    where: {
      userId: req.auth.id,
    },
    include: ['colleague'],
  })
  if (!notifications) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(notifications)
})

router.post('/', async (req, res) => {
  const user = await User.findByPk(req.auth.id)
  if (!user) throw Error(RouteErrors.IMPROPER_FORMAT.key)
  const colleague = await User.findOne({ where: { email: req.body.email } })
  if (!colleague) throw Error(RouteErrors.COLLEAGUE_DOESNT_EXIST.key)

  try {
    let type
    let email
    if (req.body.type === Notification.types.colleagueRequest) {
      type = Notification.types.colleagueRequest
      email = colleagueRequestEmail(colleague.email, user.nickname)
      await sgMail.send(email)
    } else if (req.body.type === Notification.types.issueAssigned) {
      type = Notification.types.issueAssigned
      email = issueAssignEmail(colleague.email, user.nickname)
      await sgMail.send(email)
    } else {
      type = Notification.types.colleagueConfirmed
      email = colleagueConfirmed(colleague.email, user.nicknaname)
      await sgMail.send(email)
    }
    const notification = await Notification.create({
      type,
      message: email.text,
      userId: colleague.id,
      colleagueId: user.id,
    })
    res.json({ notification })
  } catch (error) {
    console.log('error: ', error)
    throw Error(RouteErrors.IMPROPER_FORMAT.key)
  }
})

module.exports = router
