require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  AUDIENCE: process.env.AUTH0_AUDIENCE,
  ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
};
