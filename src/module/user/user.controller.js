const userService = require('./user.service');
const userHelper = require('./user.helper');

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userHelper.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const newUser = await userService.createUser({ first_name, last_name, email, password });
        
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userHelper.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = await userService.loginUser(user, password);

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    login,
};
