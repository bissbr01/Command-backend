require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  AUDIENCE: process.env.AUDIENCE,
  ISSUER_BASE_URL: process.env.ISSUER_BASE_URL,
};
