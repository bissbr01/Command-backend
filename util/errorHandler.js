const errorHandler = (err, req, res, next) => {
  if (err.message === 'Unable to perform operation') {
    res.status(400).end()
  }
  if (err.message === 'Your request is improperly formatted') {
    res.status(400).end()
  }
  if (err.message === 'Invalid username or password') {
    res.status(401).json({ error: 'test' }).end()
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).end()
  }
  if (err.message === 'account disabled, please contact admin') {
    res.status(401).end()
  }
  if (err.message === 'You must be authenticated to perform this action.') {
    res.status(403).end()
  }
  if (err.message === 'Your account has been disabled') {
    res.status(403).end()
  }
  if (err.message === 'Your session has expired') {
    res.status(403).end()
  }
  if (err.message === 'You do not have permission to perform this action') {
    res.status(403).end()
  }
  if (err.message === 'Resource not found') {
    res.status(404).end()
  }
  if (err.message === 'Could not find current user by sub') {
    res.status(404).end()
  }
  next(err)
}

module.exports = errorHandler
