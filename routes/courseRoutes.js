const router = require('express').Router();
const courseController = require('../controllers/courseController');
// const { authGuard, adminGuard } = require('../middleware/authGuard');


router.post('/create', courseController.createCourse);

//fetch all courses
router.get('/get_all_course',  courseController.getAllCourse);

//fetch single course
router.get('/get_single_course/:id', courseController.getSingleCourse);

//delete course
router.delete('/delete_course/:id', courseController.deleteCourse);

//update course
router.put('/update_course/:id', courseController.updateCourse);

module.exports = router;