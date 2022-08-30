const sequelize = require('./utils/db.js');
const Blog = require('./models/blog.js');

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await Blog.findAll();
    blogs.forEach((blog) =>
      console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
    );
    await sequelize.close();
  } catch (error) {
    console.warn(error);
  }
};

main();
