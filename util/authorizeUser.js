const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const { AUDIENCE, ISSUER_BASE_URL } = require('./config');
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  issuerBaseURL: ISSUER_BASE_URL,
  audience: AUDIENCE,
});

module.exports = { checkJwt, requiredScopes };
