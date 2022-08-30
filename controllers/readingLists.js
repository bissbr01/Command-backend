const tokenExtractor = require('../utils/tokenExtractor');
const { ReadingList } = require('../models');
const authorizeUser = require('../utils/authorizeUser');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const readingList = await ReadingList.create(req.body);
  if (!readingList) throw new Error('Resource not found');

  res.json(readingList);
});

router.put('/:id', tokenExtractor, authorizeUser, async (req, res) => {
  const user = req.authorizedUser;

  const readingList = await ReadingList.findByPk(req.params.id);
  if (!readingList) throw new Error('Resource not found');

  if (readingList.userId !== user.id)
    throw new Error('You do not have permission to perform this action');

  try {
    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
