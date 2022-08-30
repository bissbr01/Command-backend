const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, Session } = require('../models');
const { SECRET } = require('../utils/config');

router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });
  if (!user) {
    throw new Error('Resource not found');
  }

  if (user.disabled) throw new Error('account disabled, please contact admin');

  const passwordCorrect = await bcrypt.compare(body.password, user.password);
  if (!passwordCorrect) {
    throw new Error('Invalid username or password');
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '24h' });
  await Session.create({ token });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
