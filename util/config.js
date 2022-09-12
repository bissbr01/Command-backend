require('dotenv').config()

const AUDIENCE =
  process.env.NODE_ENV === 'production'
    ? process.env.AUDIENCE
    : 'http://localhost:3001'
const ISSUER =
  process.env.NODE_ENV === 'production'
    ? process.env.ISSUER
    : 'http://localhost:3001'

// Consider configuring development and test database
const DATABASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL

module.exports = {
  DATABASE_URL: DATABASE_URL,
  AUDIENCE: AUDIENCE,
  ISSUER: ISSUER,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
}
