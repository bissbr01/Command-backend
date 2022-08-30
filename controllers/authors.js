const sequelize = require('sequelize');
const router = require('express').Router();
const { Blog, User } = require('../models');

router.get('/', async (req, res) => {
  // group by author, then aggregate num of blogs for that author
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'blog_count'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes'],
    ],
    group: 'author',
    order: [['total_likes', 'DESC']],
  });
  res.json(blogs);
});

module.exports = router;
