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

router.put('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.id);
    if (!sprint) throw new Error('Resource not found');
    const attributes = Object.keys(req.body);
    attributes.forEach((attr) => (sprint[attr] = req.body[attr]));
    await sprint.save();
    res.json(sprint);
  } catch (error) {
    console.error(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.id);
    if (!sprint) throw new Error('Resource not found');
    const result = await sprint.destroy();
    if (!result) throw new Error('Unable to perform operation');
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
