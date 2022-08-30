const { Op } = require('sequelize');
const { Blog, User, Session } = require('../models');
const authorizeUser = require('../utils/authorizeUser');
const tokenExtractor = require('../utils/tokenExtractor');
const router = require('express').Router();

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
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  if (!blogs) throw new Error('Resource not found');
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) throw new Error('Resource not found');
  res.json(blog);
});

router.post('/', tokenExtractor, authorizeUser, async (req, res) => {
  const user = req.authorizedUser;
  try {
    const blog = await Blog.create({ ...req.body, userId: user.id });

    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) throw new Error('Resource not found');

  blog.likes += 1;
  await blog.save();
  res.json({ likes: blog.likes });
});

router.delete('/:id', tokenExtractor, authorizeUser, async (req, res) => {
  console.log('params.id: ', req.params.id);

  const blog = await Blog.findByPk(req.params.id);
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
