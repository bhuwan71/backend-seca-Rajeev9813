// __tests__/userController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const userController = require('../controllers/userControllers'); // Adjust path if necessary

const app = express();
app.use(express.json());
app.post('/login', userController.loginUser);

describe('User Controller', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb+srv://bhuwanchettri71:12345@testdb.4pz3ze7.mongodb.net/?retryWrites=true&w=majority&appName=TestDB', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        // Clear the User collection after each test
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await mongoose.connection.close();
    });

    it('should log in successfully with valid credentials', async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash('12345', 10);
        const user = new User({
            email: 'admin1@example.com',
            password: hashedPassword,
            isAdmin: false,
        });
        await user.save();

        // Make a POST request to log in
        const response = await request(app)
            .post('/login')
            .send({ email: 'admin1@example.com', password: '12345' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login Successful!');
        expect(response.body.token).toBeDefined();
        expect(response.body.userData.email).toBe('admin1@example.com');
    });

    it('should return an error if email or password is missing', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'admin1@example.com' }); // Missing password

        expect(response.status).toBe(200); // Adjust based on your implementation
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Please enter all fields!');
    });

    it('should return an error if the user does not exist', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'admin1@example.com', password: '12345' });

        expect(response.status).toBe(200); // Adjust based on your implementation
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User not exists!');
    });

    it('should return an error if the password is incorrect', async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash('12345', 10);
        const user = new User({
            email: 'admin1@example.com',
            password: hashedPassword,
            isAdmin: false,
        });
        await user.save();

        const response = await request(app)
            .post('/login')
            .send({ email: 'admin1@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(200); // Adjust based on your implementation
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password not matched!');
    });
});
