const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'https://scrum-management-backend.herokuapp.com/',
  issuerBaseURL: `https://dev-w8p6njku.us.auth0.com/`,
});

module.exports = { checkJwt, requiredScopes };
