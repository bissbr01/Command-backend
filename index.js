const express = require('express');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const usersRouter = require('./controllers/users');
const projectsRouter = require('./controllers/projects');

const errorHandler = require('./util/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
