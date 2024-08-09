//importing packages
const express = require('express');
const connectDatabase = require ('./database/database');
const dotenv = require('dotenv');
const cors = require('cors');
const acceptFormData = require('express-fileupload');
const path = require('path');
const fs = require('fs');

//creating an express app
const app = express();


// Configure Cors Policy
const corsOptions = {
    origin : true,
    credentials : true,
    optionSuccessStatus : 200
}
app.use(cors(corsOptions))

// Express Json Config
app.use(express.json())

//Config Form data
app.use(acceptFormData());

//Making a static public folder
app.use(express.static("./public"));


//dotenv configuration
dotenv.config();

//Defining the port
const PORT = process.env.PORT || 8000; 

// Making a test endpoint
// Endpoints : POST, GET, PUT, DELETE
app.get('/test', (req,res)=>{
    res.send("Test API is Working!...")
})

// http://localhost:5000/test to check in postman 


// Use the admin routes
app.use('/api/admin',  require('./routes/adminRoutes'));


// configuring Routes of User
app.use('/api/user', require('./routes/userRoutes'));

// configuring Routes of Course
app.use('/api/course', require('./routes/courseRoutes'));

// configuring Routes of Quiz
app.use('/api/quiz', require('./routes/quizzesRoutes'));

app.use('/api/result', require('./routes/resultRoute'));


// Connecting to database
connectDatabase();


//Starting the Server
app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}!`)
})