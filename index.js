const express = require('express')
const cors = require('cors')
require('express-async-errors')
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
const notificationRouter = require('./controllers/notifications')
const { errorHandler } = require('./util/errorHandler')
const setAuthId = require('./util/setAuthId')

const app = express()

app.use(cors())
app.use(express.json())

// require auth token to access all resources except those excluded in config
app.use(auth0CheckJwt)
app.use(setAuthId)

app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/sprints', sprintsRouter)
app.use('/api/issues', issuesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/memberships', membershipsRouter)
app.use('/api/login', loginRouter)
app.use('/api/notifications', notificationRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
