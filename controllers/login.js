const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../util/config')

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: { email },
    attributes: { include: 'password' },
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password)

  if (!passwordCorrect) {
    throw new Error('Invalid username or password')
  }

  if (user.disabled) {
    throw new Error('Your account has been disabled')
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
    user: { fullName: user.fullName, email: user.email, admin: user.admin },
    token,
  })
})

module.exports = loginRouter
