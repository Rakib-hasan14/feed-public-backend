const postHelper = require('./post.helper');
const postService = require('./post.service');

const getFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const posts = await postHelper.findPostsForFeed(userId, limit, page);
        
        console.log(`Backend: Fetched ${posts.length} posts for page ${page} with limit ${limit}`);
        
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

                if (comment.replies) {
                    comment.replies = await Promise.all(comment.replies.map(async reply => {
                        const replyLikes = await postHelper.getLikes(reply.id, 'comment'); // replies are comments too
                        return {
                            ...reply.toJSON ? reply.toJSON() : reply,
                            likesCount: replyLikes.length,
                            likedByMe: replyLikes.some(l => l.userId === userId),
                            likes: replyLikes
                        };
                    }));
                }
                return comment;
            }));

            return pData;
        }));

        console.log(`Backend: Returning ${enhancedPosts.length} enhanced posts`);
        res.status(200).json(enhancedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching feed' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content, privacy } = req.body;
        const imageUrl = req.file ? req.file.location : null;
        const userId = req.user.id;

        if (!content && !imageUrl) return res.status(400).json({ message: 'Content or image is required' });

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

const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;
        const deleted = await postService.deletePost(postId, userId);
        if (!deleted) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { content, privacy } = req.body;
        const userId = req.user.id;
        const [updated] = await postService.updatePost(postId, userId, { content, privacy });
        if (!updated) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.status(200).json({ message: 'Post updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating post' });
    }
};

const updatePostPrivacy = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { privacy } = req.body;
        const userId = req.user.id;
        const post = await postHelper.findPostById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
        post.privacy = privacy;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating privacy' });
    }
};

module.exports = {
    getFeed,
    createPost,
    createComment,
    toggleLike,
    deletePost,
    updatePost,
    updatePostPrivacy
};
