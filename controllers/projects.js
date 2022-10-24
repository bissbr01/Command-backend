const router = require('express').Router()

const { Project, Sprint, Team } = require('../models')

router.get('/', async (req, res) => {
  const projects = await Project.findAll({
    include: ['lead', 'team'],
  })
  if (!projects) throw Error('Resource not found')
  res.json(projects)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw Error('Your request is improperly formatted')
  }
  const project = await Project.findByPk(req.params.id, {
    // where: {
    //   authorId: req.auth.id,
    // },
    include: { model: User, as: 'lead' },
  })
  if (!project) throw Error('Resource not found')
  res.json(project)
})

router.post('/', async (req, res) => {
  try {
    const project = await Project.create(
      {
        ...req.body,
        sprints: [
          {
            active: true,
            displayOnBoard: true,
            authorId: req.auth.id,
            goal: '',
          },
        ],
      },
      {
        include: Sprint,
        include: Team,
      }
    )
    if (!project) throw Error('Unable to perform operation')
    res.json(project)
  } catch (error) {
    console.log('err.name', error.name)
    console.log('err.message', error.message)
    console.log('err.errors', error.errors)
    res.json(error)
  }
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
