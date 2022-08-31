const router = require('express').Router();

const { Project } = require('../models');

router.get('/', async (req, res) => {
  const projects = Project.findAll({
    // include: 'author',
  });
  res.json(projects);
});

router.post('/', async (req, res) => {
  const project = await Project.create(req.body);
  if (!project) throw new Error('Resource not found');
  res.json(project);
});

module.exports = router;
