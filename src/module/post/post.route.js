const { Router } = require('express');
const postController = require('./post.controller');
const authenticate = require('../../middleware/auth');

const router = Router();

router.use(authenticate); // ALL post routes are protected

router.get('/', postController.getFeed);
router.post('/', postController.createPost);
router.post('/:id/comments', postController.createComment);
router.post('/like', postController.toggleLike);

module.exports = router;
