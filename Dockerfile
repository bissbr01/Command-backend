# syntax=docker/dockerfile:1
FROM node:18-alpine
ENV APP_ROOT="/home/bissbr01/projects/command/backend/scrum-management-backend/"
ENV NODE_ENV=production
WORKDIR ${APP_ROOT}
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD npm run start
EXPOSE 443 3001
