const { Op } = require('sequelize')
const { Comment, User } = require('../models')
const router = require('express').Router()

router.get('/issue/:issueId', async (req, res) => {
  const comments = await Comment.findAll({
    where: { issueId: req.params.issueId },
    include: [{ model: User, as: 'author' }],
    order: [['createdAt', 'DESC']],
  })
  if (!comments) throw Error('Resource not found')
  res.json(comments)
})

router.get('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id, {
    include: [{ model: User, as: 'author' }],
  })
  if (!comment) throw Error('Resource not found')
  res.json(comment)
})

router.get('/', async (req, res) => {
  let where = {}
  const comments = await Comment.findAll({
    include: 'author',
    where,
    order: [['createdAt', 'DESC']],
  })
  if (!comments) throw Error('Resource not found')
  res.json(comments)
})

router.post('/', async (req, res) => {
  const comment = await Comment.create({
    authorId: req.auth.id,
    issueId: req.body.issueId,
    text: req.body.text,
  })
  if (!comment) throw Error('Unable to perform operation')
  return res.json(comment)
})

router.patch('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) throw Error('Resource not found')

  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (comment[attr] = req.body[attr]))
  await comment.save()
  res.json(comment)
})

router.delete('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) throw Error('Resource not found')

  if (req.auth.id !== comment.authorId) {
    throw Error('You do not have permission to perform this action')
  }

  const result = await comment.destroy()
  if (!result) throw Error('Unable to perform operation')
  res.status(200).json({ success: true, id: comment.id })
})

module.exports = router
