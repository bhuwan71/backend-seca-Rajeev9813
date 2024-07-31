const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
});

// Define the model based on the schema
const User = mongoose.model('User', userSchema); 

// Export the model
module.exports = User; // Correctly export 'User'
