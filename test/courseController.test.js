// __tests__/courseController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const courseController = require('../controllers/courseController'); // Adjust path if necessary

const app = express();
app.use(express.json());
app.post('/create-course', courseController.createCourse);

describe('Course Controller', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb+srv://bhuwanchettri71:12345@testdb.4pz3ze7.mongodb.net/?retryWrites=true&w=majority&appName=TestDB', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await mongoose.connection.close();
    });

    it('should create a course successfully with valid fields', async () => {
        const response = await request(app)
            .post('/create-course')
            .send({
                courseName: 'JavaScript Basics',
                coursePrice: 100,
                courseCategory: 'Programming',
                courseDescription: 'An introductory course on JavaScript'
            });

        expect(response.status).toBe(200); // Adjust based on your implementation
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Course created successfully!');
    });

    it('should return an error if any field is missing', async () => {
        const response = await request(app)
            .post('/create-course')
            .send({
                courseName: 'JavaScript Basics',
                coursePrice: 100,
                // Missing courseCategory
                courseDescription: 'An introductory course on JavaScript'
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Enter all fields!');
    });

    it('should return an error if all fields are missing', async () => {
        const response = await request(app)
            .post('/create-course')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Enter all fields!');
    });
});
