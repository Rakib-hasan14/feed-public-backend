const postHelper = require('./post.helper');
const postService = require('./post.service');

const getFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await postHelper.findPostsForFeed(userId);
        
        // Enhance posts with like count & status (We can do this in mapping)
        // For production with millions of posts, this aggregation should be done in DB instead of memory loop.
        const enhancedPosts = await Promise.all(posts.map(async post => {
            const postLikes = await postHelper.getLikes(post.id, 'post');
            const pData = post.toJSON();
            pData.likesCount = postLikes.length;
            pData.likedByMe = postLikes.some(l => l.userId === userId);
            pData.likes = postLikes;

            pData.Comments = await Promise.all(pData.Comments.map(async comment => {
                const commentLikes = await postHelper.getLikes(comment.id, 'comment');
                comment.likesCount = commentLikes.length;
                comment.likedByMe = commentLikes.some(l => l.userId === userId);
                comment.likes = commentLikes;
                return comment;
            }));

            return pData;
        }));

        res.status(200).json(enhancedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching feed' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content, imageUrl, privacy } = req.body;
        const userId = req.user.id;

        if (!content) return res.status(400).json({ message: 'Content is required' });

        const post = await postService.createPost(userId, content, imageUrl, privacy);
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

const createComment = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { content, parentId } = req.body;
        const userId = req.user.id;

        if (!content) return res.status(400).json({ message: 'Content is required' });

        const post = await postHelper.findPostById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await postService.createComment(userId, postId, parentId, content);
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment' });
    }
};

const toggleLike = async (req, res) => {
    try {
        const { entityId, entityType } = req.body; // entityType: 'post' or 'comment'
        const userId = req.user.id;

        if (!entityId || !['post', 'comment'].includes(entityType)) {
            return res.status(400).json({ message: 'Invalid entity to like' });
        }

        const existingLike = await postHelper.findLike(userId, entityId, entityType);
        const isLiked = await postService.toggleLike(userId, entityId, entityType, existingLike);

        res.status(200).json({ liked: isLiked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error toggling like' });
    }
};

module.exports = {
    getFeed,
    createPost,
    createComment,
    toggleLike
};
