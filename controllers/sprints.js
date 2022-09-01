const router = require('express').Router();

const { Sprint } = require('../models');

router.get('/', async (req, res) => {
  const sprints = await Sprint.findAll({
    include: 'author',
  });
  if (!sprints) throw new Error('Resource not found');
  res.json(sprints);
});

router.post('/', async (req, res) => {
  const sprints = await Sprint.create(req.body);
  if (!sprints) throw new Error('Unable to perform operation');
  res.json(sprints);
});

module.exports = router;
