const express = require('express')
const cors = require('cors')
require('express-async-errors')
const jwtVerify = require('./util/jwtVerify')
const auth0CheckJwt = require('./util/auth0CheckJwt')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const usersRouter = require('./controllers/users')
const projectsRouter = require('./controllers/projects')
const sprintsRouter = require('./controllers/sprints')
const issuesRouter = require('./controllers/issues')
const commentsRouter = require('./controllers/comments')
const teamsRouter = require('./controllers/teams')
const membershipsRouter = require('./controllers/memberships')
const loginRouter = require('./controllers/login')
const errorHandler = require('./util/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

// require auth token to access all resources except those excluded in config
app.use(jwtVerify)

app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/sprints', sprintsRouter)
app.use('/api/issues', issuesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/memberships', membershipsRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

app.get('/api/auth0', auth0CheckJwt, (req, res) => {
  res.send({ auth: req.auth })
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
