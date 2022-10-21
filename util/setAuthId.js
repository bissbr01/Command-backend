const setAuthId = (req, res, next) => {
  // auth0 auth.sub has been set as the id primary key for users.
  // this simply points auth.id at the auth.sub provided by the auth0 jwt verifying middleware
  req.auth.id = req.auth.sub
  next()
}

module.exports = setAuthId
