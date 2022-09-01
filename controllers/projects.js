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

router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw new Error('Resource not found');
    const attributes = Object.keys(req.body);
    attributes.forEach((attr) => (project[attr] = req.body[attr]));
    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw new Error('Resource not found');
    const result = await project.destroy();
    if (!result) throw new Error('Unable to perform operation');
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
