const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  try {
    const saltRounds = 8;
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    const user = await User.create({ ...req.body, password: passwordHash });
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:username', async (req, res) => {
  const where = {};
  if (req.query.read) {
    where.read = req.query.read === 'true';
  }
  const user = await User.findOne({
    where: { username: req.params.username },
    include: {
      model: Blog,
      as: 'reading_list',
      attributes: { exclude: ['userId'] },
      through: {
        where,
        attributes: ['read', 'id'],
      },
    },
  });
  if (!user) throw new Error('Resource not found');
  res.json(user);
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (!user) throw new Error('Resource not found');
  user.username = req.body.username;
  await user.save();
  res.json(user);
});

module.exports = router;
