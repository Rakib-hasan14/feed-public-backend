const { User } = require('../../entities');

/**
 * Find a user by email
 * @param {string} email
 * @returns {Promise<Object>} user object
 */
const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

/**
 * Find a user by ID
 * @param {number} id
 * @returns {Promise<Object>} user object
 */
const findUserById = async (id) => {
    return await User.findByPk(id);
};

module.exports = {
    findUserByEmail,
    findUserById,
};
