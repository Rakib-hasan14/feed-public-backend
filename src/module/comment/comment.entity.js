const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'comments',
        timestamps: true,
    });
};
