// controllers/adminController.js
const User = require('../models/userModel'); // Adjust the path as needed
const bcrypt = require('bcrypt');

exports.createAdmin = async (req, res) => {
    try {
        // Check if an admin already exists
        const existingAdmin = await User.findOne({ isAdmin: true });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists.' });
        }

        // Define default admin values
        const adminData = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin1@gmail.com',
            password: '12345',
            isAdmin: true
        };

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        // Create and save the admin user
        const newAdmin = new User(adminData);
        await newAdmin.save();
        res.status(201).json({ message: 'Admin user created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
