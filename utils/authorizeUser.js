const { User, Session } = require('../models');

const authorizeUser = async (req, res, next) => {
  if (!req.decodedToken) throw new Error('Not logged in');
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) throw new Error('Not logged in');
    if (user.disabled) throw new Error('Your account has been disabled');
    const session = await Session.findOne({ where: { token: req.token } });
    if (!session) throw new Error('Your session has expired');

    req.authorizedUser = user;
    console.log('authed user: ', req.authorizedUser);
  } catch (error) {
    console.log(error.message);
  }

  next();
};

module.exports = authorizeUser;
