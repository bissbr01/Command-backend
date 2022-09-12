const { Op } = require('sequelize')
const { Comment } = require('../models')
const router = require('express').Router()

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ],
    }
  }
  const comments = await Comment.findAll({
    // attributes: { exclude: ['userId'] },
    include: 'author',
    where,
    order: [['createdAt', 'DESC']],
  })
  if (!comments) throw new Error('Resource not found')
  res.json(comments)
})

router.get('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) throw new Error('Resource not found')
  res.json(comment)
})

router.post('/', async (req, res) => {
  try {
    const comment = await Comment.create(req.body)

    return res.json(comment)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id)
    if (!comment) throw new Error('Resource not found')
    console.log('req.body: ', req.body)

    const attributes = Object.keys(req.body)
    attributes.forEach((attr) => (comment[attr] = req.body[attr]))
    await comment.save()
    res.json(comment)
  } catch (error) {
    console.log(error)
  }
})

router.delete('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) throw new Error('Resource not found')

  // if (user.id !== issue.userId) {
  //   throw new Error('You do not have permission to perform this action');
  // }

  const result = await comment.destroy()
  if (!result) throw new Error('Unable to perform operation')
  res.status(200).json({ result })
})

module.exports = router
