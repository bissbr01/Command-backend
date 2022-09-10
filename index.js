const express = require('express');
const cors = require('cors');
const jwtCheck = require('./util/jwtCheck');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const usersRouter = require('./controllers/users');
const projectsRouter = require('./controllers/projects');
const sprintsRouter = require('./controllers/sprints');
const issuesRouter = require('./controllers/issues');
const errorHandler = require('./util/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// require auth0 token to access all resources
app.use(jwtCheck);

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
