// __tests__/quizController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('../models/quizModel'); // Adjust path if necessary
const quizController = require('../controllers/quizController'); // Adjust path if necessary

const app = express();
app.use(express.json());
app.delete('/delete-quiz/:id', quizController.deleteQuiz);

describe('Quiz Controller', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb+srv://bhuwanchettri71:12345@testdb.4pz3ze7.mongodb.net/?retryWrites=true&w=majority&appName=TestDB', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        // Clear the Quiz collection after each test
        await Quiz.deleteMany({});
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await mongoose.connection.close();
    });

    it('should delete a quiz successfully when valid ID is provided', async () => {
        // Create a quiz to delete
        const quiz = new Quiz({
            quizName: 'Sample Quiz',
            quizDescription: 'This is a sample quiz',
            quizCategory: 'General Knowledge',
        });
        await quiz.save();

        const response = await request(app)
            .delete(`/delete-quiz/${quiz._id}`);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Quiz deleted successfully!');

        const deletedQuiz = await Quiz.findById(quiz._id);
        expect(deletedQuiz).toBeNull();
    });

    it('should return an error if the quiz ID does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/delete-quiz/${nonExistentId}`);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.error).toBe('Quiz not found'); // Ensure this matches your actual error handling logic
    });

    it('should handle server errors gracefully', async () => {
        // Temporarily simulate an error by making Quiz.findByIdAndDelete throw an error
        jest.spyOn(Quiz, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Database Error');
        });

        const response = await request(app)
            .delete(`/delete-quiz/${new mongoose.Types.ObjectId()}`);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.error).toBe('Database Error');

        // Restore the original implementation of Quiz.findByIdAndDelete
        Quiz.findByIdAndDelete.mockRestore();
    });
});
