const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/buddy_script_db',
  {
    dialect: 'postgres',
    logging: false,
  }
);

// Import Entities
const User = require('./module/user/user.entity')(sequelize);
const Post = require('./module/post/post.entity')(sequelize);
const Comment = require('./module/comment/comment.entity')(sequelize);
const Like = require('./module/like/like.entity')(sequelize);

// --- Define Relationships ---
// User & Post
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// User & Comment
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Post & Comment
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// Comment Replies (Self-referencing)
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });

// User & Like
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connection has been established successfully.');
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    connectDB,
    User,
    Post,
    Comment,
    Like
};
