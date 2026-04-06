const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        privacy: {
            type: DataTypes.ENUM('public', 'private'),
            defaultValue: 'public',
        }
    }, {
        tableName: 'posts',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['privacy'] },
            { fields: ['createdAt'] },
            // Optimized index for feed retrieval: privacy + descending order
            { fields: ['privacy', 'createdAt'] }
        ]
    });
};
