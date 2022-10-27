const { Op } = require('sequelize')
const { Comment, User } = require('../models')
const router = require('express').Router()
const { RouteErrors } = require('../util/errorHandler')

router.get('/issue/:issueId', async (req, res) => {
  const comments = await Comment.findAll({
    where: { issueId: req.params.issueId },
    include: [{ model: User, as: 'author' }],
    order: [['createdAt', 'DESC']],
  })
  if (!comments) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(comments)
})

router.get('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id, {
    include: [{ model: User, as: 'author' }],
  })
  if (!comment) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(comment)
})

router.get('/', async (req, res) => {
  let where = {}
  const comments = await Comment.findAll({
    include: 'author',
    where,
    order: [['createdAt', 'DESC']],
  })
  if (!comments) throw Error(RouteErrors.NOT_FOUND.key)
  res.json(comments)
})

router.post('/', async (req, res) => {
  const comment = await Comment.create({
    authorId: req.auth.id,
    issueId: req.body.issueId,
    text: req.body.text,
  })
  if (!comment) throw Error(RouteErrors.OPERATION_FAILED.key)
  return res.json(comment)
})

router.patch('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) throw Error(RouteErrors.NOT_FOUND.key)

  const attributes = Object.keys(req.body)
  attributes.forEach((attr) => (comment[attr] = req.body[attr]))
  await comment.save()
  res.json(comment)
})

router.delete('/:id', async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) throw Error(RouteErrors.NOT_FOUND.key)

  if (req.auth.id !== comment.authorId) {
    throw Error(RouteErrors.INSUFFICIENT_PERMISSION.key)
  }

  const result = await comment.destroy()
  if (!result) throw Error(RouteErrors.OPERATION_FAILED.key)
  res.status(200).json({ success: true, id: comment.id })
})

module.exports = router
