const sequelize = require('./util/db');
const Issue = require('./models/issue');

// heroku run psql -h ec2-3-93-206-109.compute-1.amazonaws.com -p 5432 -U fcnpwwppwypmnm ddsibrl7u29cpm -a salty-dusk-24407

const main = async () => {
  try {
    await sequelize.authenticate();
    const issues = await Issue.findAll();
    issues.forEach((issue) =>
      console.log(`${issue.author}: ${issue.title}, ${issue.likes} likes`)
    );
    await sequelize.close();
  } catch (error) {
    console.warn(error);
  }
};

main();
