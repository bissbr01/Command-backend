# syntax=docker/dockerfile:1
FROM node:18-alpine
ENV APP_ROOT="C:\\Coding\\Portfolio Projects\\Scrum management app\\Backend"
WORKDIR ${APP_ROOT}
COPY . .
RUN npm install
CMD 'node index.js'
EXPOSE 3001