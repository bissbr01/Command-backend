const jwt = require('jsonwebtoken');
const router = require('express').Router();
const tokenExtractor = require('../utils/tokenExtractor');

const { User, Session } = require('../models');

router.delete('/', tokenExtractor, async (req, res) => {
  const token = req.token;
  if (!token) throw new Error('Not logged in');

  const session = await Session.findOne({ where: { token } });
  if (!session) throw new Error('Resource not found');

  console.log('session instance: ', session);

  try {
    await session.destroy();
  } catch (error) {
    console.log(error.message);
  }

  res.status(200).send('Logged out');
});

module.exports = router;
