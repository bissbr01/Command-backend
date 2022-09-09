const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const { AUDIENCE, ISSUER_BASE_URL } = require('./config');
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: AUDIENCE,
  issuerBaseURL: ISSUER_BASE_URL,
  jwksUri: 'https://dev-w8p6njku.us.auth0.com/.well-known/jwks.json',
});

module.exports = { checkJwt, requiredScopes };
