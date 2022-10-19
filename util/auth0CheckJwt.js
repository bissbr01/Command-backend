const { expressjwt: jwt } = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const { SECRET, ISSUER_BASE_URL, AUDIENCE, CLIENT_ID } = require('./config')

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-w8p6njku.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://scrum-management-backend.onrender.com',
  issuer: 'https://dev-w8p6njku.us.auth0.com/',
  algorithms: ['RS256'],
})

module.exports = checkJwt
