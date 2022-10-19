require('dotenv').config()

// Consider configuring development and test database
const DATABASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL

module.exports = {
  DATABASE_URL: DATABASE_URL,
  AUDIENCE: process.env.AUDIENCE,
  ISSUER: process.env.ISSUER,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
}
