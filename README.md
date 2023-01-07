# scrum-management-backend
A REST API for the Command project managment app.  

For demonstration purposes, here is a model of the database this API exposes:

![scrum-managmenet-backend-model pgerd](https://user-images.githubusercontent.com/13155120/201134035-820867b2-1e65-4e2e-998d-f48d9580cf72.png)

## How to Install
Fork and install dependencies with `npm install`.

The schema for the PostgreSQL will be automatically created by the [Sequelize migrations](https://sequelize.org/docs/v6/other-topics/migrations/) on first run.  

You will need setup and configure enviornment variables for [Auth0](https://auth0.com/docs), [PostgreSQL database](https://aws.amazon.com/rds/), and for the [Sendgrid email API](https://sendgrid.com/).  Follow links for instructions.  

Your enviornemnt variables should include the following:

    DATABASE_URL='database url'
    AUDIENCE='Your host url'
    ISSUER='Auth0 issuer'
    SECRET='Optional secret if you want to enable direct authorization not federated by Auth0'
    SENDGRID_API_KEY='sendgrid api key'
    RDS_DB_HOST='aws rds host'
    RDS_DB_USER='user'
    RDS_DB_PASS='pass'
    RDS_DB_PORT='5432 for PostgreSQL'
    RDS_DB_NAME='db name'

After its configured, You can run the service using `npm start`.
