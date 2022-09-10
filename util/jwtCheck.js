const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const { AUDIENCE, ISSUER_BASE_URL } = require('./config');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-w8p6njku.us.auth0.com/.well-known/jwks.json',
  }),
  audience: AUDIENCE,
  issuer: ISSUER_BASE_URL,
  algorithms: ['RS256'],
});

module.exports = jwtCheck;
