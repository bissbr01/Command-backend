const sequelize = require('./util/db')
const Issue = require('./models/issue')

const main = async () => {
  try {
    await sequelize.authenticate()
    const issues = await Issue.findAll()
    issues.forEach((issue) =>
      console.log(`${issue.author}: ${issue.title}, ${issue.likes} likes`)
    )
    await sequelize.close()
  } catch (error) {
    console.warn(error)
  }
}

main()
