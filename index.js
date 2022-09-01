const express = require('express');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const jwtCheck = require('./util/jwtCheck');
const usersRouter = require('./controllers/users');
const projectsRouter = require('./controllers/projects');
const sprintsRouter = require('./controllers/sprints');
const issuesRouter = require('./controllers/issues');
const loginRouter = require('./controllers/login');

const errorHandler = require('./util/errorHandler');

const app = express();

app.use(express.json());
app.use(jwtCheck);

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/sprints', sprintsRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
