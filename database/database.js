const mongoose = require("mongoose");

//External File

//make a unique function name : connectDatabase

//Defining a function
const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_CLOUD || "mongodb+srv://test:test@cluster0.2ifqodq.mongodb.net/").then(() => {
    //Functions (Connection)
    console.log("Database Connected !");
  });
};

//Exporting the function
module.exports = connectDatabase;
