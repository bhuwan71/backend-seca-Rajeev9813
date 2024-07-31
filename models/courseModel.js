const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName : { //course name
        type : String,
        required : true
    },
    coursePrice : { //price
        type : Number,
        required : true
    },
    courseCategory : {
        type : String,
        required : true
    },
    courseDescription : {
        type : String,
        required : true,
        maxLength : 200
    },
    courseImage : {
        type : String,
        required : true
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
});

const course = mongoose.model("courses",courseSchema);  // to export into controller
module.exports = course;