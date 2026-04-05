const { Router } = require('express');
const postController = require('./post.controller');
const authenticate = require('../../middleware/auth');
const upload = require('../../helper/upload');

const router = Router();

router.use(authenticate); // ALL post routes are protected

router.get('/', postController.getFeed);
router.post('/', upload.single('image'), postController.createPost);
router.post('/:id/comments', postController.createComment);
router.patch('/:id/privacy', postController.updatePostPrivacy);
router.patch('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/like', postController.toggleLike);

module.exports = router;
