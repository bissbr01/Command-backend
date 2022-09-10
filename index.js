const express = require('express');
const { auth } = require('express-openid-connect');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const usersRouter = require('./controllers/users');
const projectsRouter = require('./controllers/projects');
const sprintsRouter = require('./controllers/sprints');
const issuesRouter = require('./controllers/issues');
const auth0Config = require('./util/auth0config');

const errorHandler = require('./util/errorHandler');

const app = express();

app.use(express.json());

// auth0 router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0Config));

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/sprints', sprintsRouter);
app.use('/api/issues', issuesRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
