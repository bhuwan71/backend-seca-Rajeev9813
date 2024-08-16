// __tests__/adminController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const adminController = require('../controllers/adminController');

const app = express();
app.use(express.json());
app.post('/create-admin', adminController.createAdmin);

describe('Admin Controller', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb+srv://bhuwanchettri71:12345@testdb.4pz3ze7.mongodb.net/?retryWrites=true&w=majority&appName=TestDB', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should create a new admin when no admin exists', async () => {
        const response = await request(app)
            .post('/create-admin')
            .send();

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Admin user created successfully!');

        const admin = await User.findOne({ isAdmin: true });
        expect(admin).not.toBeNull();
        expect(await bcrypt.compare('12345', admin.password)).toBe(true);
    });

    it('should return error if admin already exists', async () => {
        const existingAdmin = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin1@gmail.com',
            password: await bcrypt.hash('12345', await bcrypt.genSalt(10)),
            isAdmin: true
        });
        await existingAdmin.save();

        const response = await request(app)
            .post('/create-admin')
            .send();

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Admin user already exists.');
    });
});
