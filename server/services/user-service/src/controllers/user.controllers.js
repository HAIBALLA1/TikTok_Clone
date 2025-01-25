import { createUser, findUserByEmail, findUserById, updateUser, deleteUser } from '../services/user.service.js';
import bcrypt from 'bcryptjs';

// User registration
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).send('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await createUser(username, email, hashedPassword);
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
};

// User login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    if (await bcrypt.compare(password, user.password)) {
        return res.json({ message: 'Login successful' });
    }

    res.status(401).send('Invalid credentials');
};

// Get user profile
export const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Get user ID from token

    try {
        const user = await findUserById(userId); // Use the service to find the user
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Error retrieving user profile');
    }
};

// Update user
export const updateUserProfile = async (req, res) => {
    const userId = req.user.id; // Get user ID from token
    const { username, email } = req.body; // Get updated data from request body

    try {
        const updatedUser = await updateUser(userId, { username, email });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send('Error updating user profile');
    }
};

// Delete user
export const deleteUserProfile = async (req, res) => {
    const userId = req.user.id; // Get user ID from token

    try {
        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).send('Error deleting user profile');
    }
};