const errorHandler = (err, req, res, next) => {
  if (err.message === 'Unable to perform operation') {
    res.status(400)
  } else if (err.message === 'Your request is improperly formatted') {
    res.status(400)
  } else if (
    err.message === 'This user is not in the system, so they cannot be added.'
  ) {
    res.status(400)
  } else if (err.message === 'Invalid username or password') {
    res.status(401)
  } else if (err.name === 'UnauthorizedError') {
    res.status(401)
  } else if (err.message === 'account disabled, please contact admin') {
    res.status(401)
  } else if (
    err.message === 'You must be authenticated to perform this action.'
  ) {
    res.status(403)
  } else if (err.message === 'Your account has been disabled') {
    res.status(403)
  } else if (err.message === 'Your session has expired') {
    res.status(403)
  } else if (
    err.message === 'You do not have permission to perform this action'
  ) {
    res.status(403)
  } else if (err.message === 'Resource not found') {
    res.status(404)
  } else if (err.message === 'Could not find current user by sub') {
    res.status(404)
  } else {
    res.status(400)
  }

  res.json({ error: err.message })
  next(err)
}

module.exports = errorHandler
