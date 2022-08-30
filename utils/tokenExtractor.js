const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.token = authorization.substring(7);
      req.decodedToken = jwt.verify(req.token, SECRET);
    } catch {
      res.status(401).json({ error: 'token invalid' });
    }
  } else {
    res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = tokenExtractor;
