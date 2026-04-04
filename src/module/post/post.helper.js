const { Post, User, Comment, Like } = require('../../entities');
const { Op } = require('sequelize');

const findPostsForFeed = async (currentUserId) => {
    return await Post.findAll({
        where: {
            [Op.or]: [
                { privacy: 'public' },
                { userId: currentUserId, privacy: 'private' }
            ]
        },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                as: 'author',
                attributes: ['id', 'first_name', 'last_name']
            },
            {
                model: Comment,
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'first_name', 'last_name']
                    },
                    {
                        model: Comment,
                        as: 'replies',
                        include: [{ model: User, as: 'author', attributes: ['id', 'first_name', 'last_name'] }]
                    }
                ]
            }
        ]
    });
};

const findPostById = async (id) => {
    return await Post.findByPk(id);
};

const findCommentById = async (id) => {
    return await Comment.findByPk(id);
};

const findLike = async (userId, entityId, entityType) => {
    return await Like.findOne({
        where: { userId, entityId, entityType }
    });
};

const getLikes = async (entityId, entityType) => {
    return await Like.findAll({
        where: { entityId, entityType },
        include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name'] }]
    });
};

module.exports = {
    findPostsForFeed,
    findPostById,
    findCommentById,
    findLike,
    getLikes
};
