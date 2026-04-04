const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../entities');

/**
 * Creates a new user in the DB
 * @param {Object} userData 
 * @returns {Promise<Object>} The created user
 */
const createUser = async (userData) => {
    const { first_name, last_name, email, password } = userData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
    });

    return newUser;
};

/**
 * Validates password and generates JWT token
 * @param {Object} user 
 * @param {string} password 
 * @returns {Promise<string>} JWT token
 */
const loginUser = async (user, password) => {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET || 'super_secret_jwt_key', 
        { expiresIn: '1d' }
    );

    return token;
};

module.exports = {
    createUser,
    loginUser,
};
