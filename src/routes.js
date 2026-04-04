const { Router } = require('express');
const userRoutes = require('./module/user/user.route');
const postRoutes = require('./module/post/post.route');

const rootRouter = Router();

// Register module routes
rootRouter.use('/users', userRoutes);
rootRouter.use('/posts', postRoutes);

module.exports = rootRouter;
