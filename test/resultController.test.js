// __tests__/resultController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Result = require('../models/resultModel'); // Adjust path if necessary
const resultController = require('../controllers/resultController'); // Adjust path if necessary

const app = express();
app.use(express.json());
app.post('/create-result', resultController.createResult);

describe('Result Controller', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb+srv://bhuwanchettri71:12345@testdb.4pz3ze7.mongodb.net/?retryWrites=true&w=majority&appName=TestDB', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        // Clear the Result collection after each test
        await Result.deleteMany({});
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await mongoose.connection.close();
    });

    it('should create a result successfully with valid fields', async () => {
        const response = await request(app)
            .post('/create-result')
            .send({
                userId: 'userId123',
                quizId: 'quizId123',
                score: 85
            });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe('userId123');
        expect(response.body.quizId).toBe('quizId123');
        expect(response.body.score).toBe(85);
    });

    it('should return an error if any required field is missing', async () => {
        const response = await request(app)
            .post('/create-result')
            .send({
                userId: 'userId123',
                // Missing quizId
                score: 85
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide all required fields');
    });

    it('should handle server errors gracefully', async () => {
        // Temporarily simulate an error by making Result.create throw an error
        jest.spyOn(Result, 'create').mockImplementationOnce(() => {
            throw new Error('Database Error');
        });

        const response = await request(app)
            .post('/create-result')
            .send({
                userId: 'userId123',
                quizId: 'quizId123',
                score: 85
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database Error');

        // Restore the original implementation of Result.create
        Result.create.mockRestore();
    });
});
