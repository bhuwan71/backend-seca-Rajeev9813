//Import section
const router = require("express").Router();
const userController = require("../controllers/userControllers");

//creating user registration route
router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.get('/get_all_user',  userController.getAllUsers);
router.delete('/delete_user/:id',  userController.deleteUser);


//road map starts from controller -> export -> goes to routes -> routes (import) -> used -> configure in index.js (Routes)

//EXporting the routes to use in index
module.exports = router;
