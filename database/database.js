const mongoose = require("mongoose");

//External File

//make a unique function name : connectDatabase

//Defining a function
const connectDatabase = () => {
  mongoose
    .connect(
      process.env.MONGODB_CLOUD ||
        "mongodb+srv://bhuwanchettri71:12345@testdb.4pz3ze7.mongodb.net/?retryWrites=true&w=majority&appName=TestDB"
    )
    .then(() => {
      //Functions (Connection)
      console.log("Database Connected !");
    });
};

//Exporting the function
module.exports = connectDatabase;
