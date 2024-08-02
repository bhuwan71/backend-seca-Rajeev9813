const router = require('express').Router();
const quizController = require('../controllers/quizController');
// const { authGuard, adminGuard } = require('../middleware/authGuard');

// Create a new quiz
router.post('/create', quizController.createQuiz);

// Fetch all quizzes
router.get('/get_all_quizzes', quizController.getQuizzes);

// Fetch a single quiz by ID
router.get('/get_single_quiz/:id', quizController.getQuiz);

// Update a quiz by ID
router.put('/update_quiz/:id', quizController.updateQuiz);

// Delete a quiz by ID
router.delete('/delete_quiz/:id', quizController.deleteQuiz);

module.exports = router;
