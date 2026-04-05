const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Like', {
        entityType: {
            type: DataTypes.ENUM('post', 'comment'),
            allowNull: false,
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'likes',
        timestamps: true,
        // Composite unique key could be added to prevent duplicate likes, handled in relationships and DB design
        indexes: [
            {
                unique: true,
                fields: ['userId', 'entityType', 'entityId']
            }
        ]
    });
};
