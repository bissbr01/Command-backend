const { Op } = require('sequelize');
const router = require('express').Router();
const { Issue } = require('../models');
const { checkJwt, requiredScopes } = require('../util/authorizeUser');

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
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) throw new Error('Resource not found');
    console.log('req.body: ', req.body);

    const attributes = Object.keys(req.body);
    attributes.forEach((attr) => (issue[attr] = req.body[attr]));
    await issue.save();
    res.json(issue);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/:id', async (req, res) => {
  const issue = await Issue.findByPk(req.params.id);
  if (!issue) throw new Error('Resource not found');

  // if (user.id !== issue.userId) {
  //   throw new Error('You do not have permission to perform this action');
  // }

  const result = await issue.destroy();
  if (!result) throw new Error('Unable to perform operation');
  res.status(200).json({ result });
});

module.exports = router;
