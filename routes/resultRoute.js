const router = require('express').Router();
const resultController = require('../controllers/resultController');

// Create a new result
router.post('/create', resultController.createResult);

// Fetch all results
router.get('/get_all_results', resultController.getResults);

// Fetch a single result by ID
router.get('/get_single_result/:id', resultController.getResult);


// Get user progress
router.get('/get_user_progress/:userId', resultController.getUserProgress);

module.exports = router;
