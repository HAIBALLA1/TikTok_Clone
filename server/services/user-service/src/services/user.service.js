import User from '../models/user.model.js';

// Create user
export const createUser = async (username, email, password) => {
    const newUser = new User({ username, email, password });
    return await newUser.save();
};

// Find user by email
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Find user by ID
export const findUserById = async (id) => {
    return await User.findById(id).select('-password'); // Password is not returned
};

// Update user
export const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete user
export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};