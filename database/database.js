const mongoose = require("mongoose");

//External File

//make a unique function name : connectDatabase

//Defining a function
const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_CLOUD).then(() => {
    //Functions (Connection)
    console.log("Database Connected !");
  });
};

//Exporting the function
module.exports = connectDatabase;
