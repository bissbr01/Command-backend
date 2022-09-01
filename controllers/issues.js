const { Op } = require('sequelize');
const router = require('express').Router();
const { Issue, User } = require('../models');
const authorizeUser = require('../util/authorizeUser');
const tokenExtractor = require('../util/tokenExtractor');

router.get('/', async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ],
    };
  }
  const issues = await Issue.findAll({
    // attributes: { exclude: ['userId'] },
    include: 'author',
    where,
    // order: [['likes', 'DESC']],
  });
  if (!issues) throw new Error('Resource not found');
  res.json(issues);
});

router.get('/:id', async (req, res) => {
  const blog = await Issue.findByPk(req.params.id);
  if (!blog) throw new Error('Resource not found');
  res.json(blog);
});

router.post('/', async (req, res) => {
  try {
    const issue = await Issue.create(req.body);

    return res.json(issue);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put('/:id', async (req, res) => {
  const blog = await Issue.findByPk(req.params.id);

  if (!blog) throw new Error('Resource not found');

  blog.likes += 1;
  await blog.save();
  res.json({ likes: blog.likes });
});

router.delete('/:id', tokenExtractor, authorizeUser, async (req, res) => {
  console.log('params.id: ', req.params.id);

  const blog = await Issue.findByPk(req.params.id);
  if (!blog) throw new Error('Resource not found');
  console.log('blog found: ', blog);

  const user = req.authorizedUser;

  console.log('user found: ', user);

  if (user.id !== blog.userId) {
    throw new Error('You do not have permission to perform this action');
  }

  const result = await blog.destroy();
  if (!result) throw new Error('Unable to perform operation');
  res.status(200).json({ result });
});

module.exports = router;
