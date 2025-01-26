import { createUser, findUserByEmail, findUserById, updateUser, deleteUser } from '../services/user.service.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


// User registration
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required: username, email, and password');
    }

    try {
        // Vérifiez si l'email ou le username est déjà utilisé
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).send('Email already in use');
            }
            if (existingUser.username === username) {
                return res.status(400).send('Username already in use');
            }
        }

        // Hachez le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créez le nouvel utilisateur
        await createUser(username, email, hashedPassword);

        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Error registering user');
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
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3h' }
        );

        return res.json({ message: 'Login successful', token });
    }

    res.status(401).send('Invalid credentials');
};




// Get user profile
export const getUserProfile = async (req, res) => {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findById(userId); // Utilisation de `findById`
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).send('Error retrieving user profile');
    }
};

// Update user
export const updateUserProfile = async (req, res) => {
    const userId = req.headers['x-user-id']; // Récupère l'ID utilisateur depuis l'en-tête
    const { username, email } = req.body; // Données mises à jour

    if (!userId) {
        return res.status(401).send('Unauthorized'); // Aucun ID utilisateur fourni
    }

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
    const userId = req.headers['x-user-id']; // Récupère l'ID utilisateur depuis l'en-tête

    if (!userId) {
        return res.status(401).send('Unauthorized'); // Aucun ID utilisateur fourni
    }

    try {
        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(204).send(); // Pas de contenu
    } catch (error) {
        res.status(500).send('Error deleting user profile');
    }
};
