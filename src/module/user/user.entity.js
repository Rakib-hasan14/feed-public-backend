const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'users',
        timestamps: true,
        indexes: [
            { fields: ['email'] },
            { fields: ['first_name'] },
            { fields: ['last_name'] }
        ]
    });
};
