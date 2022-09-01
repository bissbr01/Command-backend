const router = require('express').Router();

const { Project } = require('../models');

router.get('/', async (req, res) => {
  const projects = await Project.findAll({
    include: 'author',
  });
  if (!projects) throw new Error('Resource not found');
  res.json(projects);
});

router.post('/', async (req, res) => {
  const project = await Project.create(req.body);
  if (!project) throw new Error('Unable to perform operation');
  res.json(project);
});

module.exports = router;
