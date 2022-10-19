const { expressjwt: jwt } = require('express-jwt')
const { AUDIENCE, ISSUER, SECRET } = require('./config')

const jwtVerify = jwt({
  secret: SECRET,
  algorithms: ['HS256'],
}).unless({
  path: ['/api/login', { url: '/api/users', methods: ['POST'] }, '/api/auth0'],
})

module.exports = jwtVerify
