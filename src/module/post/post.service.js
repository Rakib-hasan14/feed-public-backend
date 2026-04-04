const { Post, Comment, Like } = require('../../entities');

const createPost = async (userId, content, imageUrl, privacy) => {
    return await Post.create({
        userId,
        content,
        image_url: imageUrl,
        privacy: privacy || 'public',
    });
};

const createComment = async (userId, postId, parentId, content) => {
    return await Comment.create({
        userId,
        postId,
        parentId, // Can be null for top-level comments
        content,
    });
};

const toggleLike = async (userId, entityId, entityType, existingLike) => {
    if (existingLike) {
        // Unlike
        await existingLike.destroy();
        return false;
    } else {
        // Like
        await Like.create({ userId, entityId, entityType });
        return true;
    }
};

module.exports = {
    createPost,
    createComment,
    toggleLike
};
