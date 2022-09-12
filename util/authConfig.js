const { SECRET, ISSUER_BASE_URL, AUDIENCE, CLIENT_ID } = require('./config')

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: AUDIENCE,
  clientID: CLIENT_ID,
  issuerBaseURL: ISSUER_BASE_URL,
}

module.exports = config
