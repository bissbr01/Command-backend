const { User } = require('../models')

const getCurrentUser = async (err, req, res, next) => {
  console.log('middleware current user triggered')
  if (req.auth.sub) {
    const user = await User.findOne({
      where: {
        sub: req.auth.sub,
      },
    }).unwrap()
    if (!user) throw Error('Could not find current user by sub')
    console.log('current user', user)
    req.auth.user = user
    req.auth.id = user.id
  }
  next()
}

module.exports = getCurrentUser
