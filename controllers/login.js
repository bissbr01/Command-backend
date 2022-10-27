const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../util/config')
const { RouteErrors } = require('../util/errorHandler')

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: { email },
    attributes: { include: 'password' },
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password)

  if (!passwordCorrect) {
    throw Error(RouteErrors.INVALID_CREDENTIALS.key)
  }

  if (user.disabled) {
    throw Error(RouteErrors.ACCOUNT_DISABLED.key)
  }

  const userForToken = {
    email: user.email,
    id: user.id,
    admin: user.admin,
  }

  const token = jwt.sign(userForToken, SECRET, {
    expiresIn: '24h',
  })

  return res.status(200).send({
    token,
  })
})

module.exports = loginRouter
