const router = require('express').Router()

const { Project } = require('../models')

router.get('/', async (req, res) => {
  const projects = await Project.findAll({
    include: 'author',
  })
  if (!projects) throw Error('Resource not found')
  res.json(projects)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const project = await Project.findByPk(req.params.id, {
    where: {
      authorId: req.auth.id,
    },
    include: { model: User, as: 'author' },
  })
  if (!project) throw Error('Resource not found')
  res.json(project)
})

router.post('/', async (req, res) => {
  console.log('sub: ', req.auth.sub)
  console.log(req.auth.user)
  console.log('id: ', req.auth.id)
  const project = await Project.create({ ...req.body, authorId: req.auth.id })
  if (!project) throw Error('Unable to perform operation')
  res.json(project)
})

router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) throw Error('Resource not found')
    const attributes = Object.keys(req.body)
    attributes.forEach((attr) => (project[attr] = req.body[attr]))
    await project.save()
    res.json(project)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) throw Error('Resource not found')
    const result = await project.destroy()
    if (!result) throw Error('Unable to perform operation')
    res.status(200).json({ result })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
