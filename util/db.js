require('dotenv').config()
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize({
  database: process.env.RDS_DB_Name,
  host: process.env.RDS_DB_HOST,
  username: process.env.RDS_DB_USER,
  password: process.env.RDS_DB_PASS,
  port: process.env.RDS_DB_PORT,
  dialect: 'postgres',
  ssl: {
    require: false,
    rejectUnauthorized: false,
  },
  logging: console.log,
  language: 'en',
})

const migrationConf = {
  migrations: {
    glob: 'models/migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { sequelize, connectToDatabase, rollbackMigration }
