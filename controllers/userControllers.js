//Importing the neccessary dependencies
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); //importing user model
const jwt = require('jsonwebtoken');
const createUser = async (req,res) => {

    // Destructure the incoming data
    const {firstName, lastName, email, password} = req.body;

    // Validating the data (if empty, stop the process and send response)
    if(!firstName || !lastName || !email || !password){
        // res.send("Please enter all fields!")
        return res.json({
            "success" : false,
            "message" : "Please enter all fields!"
        })
    }

    // 4. Error Handling by Try Catch
    try {
        // Checking if the user is already registered
        const existingUser = await userModel.findOne({email : email })

        //  if user found: Send response
        if(existingUser){
            return res.json({
                "success" : false,
                "message" : "User Already Exists!"
            })
        }

        // Hashing/Encryption of the password using randomsalt and bcrypt
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,randomSalt)
        
        //  if user is new
        const newUser = new userModel({
            //format is  Database Fields : Client's Value
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : hashedPassword
        })

        // Saving to database
        await newUser.save()

        // sending the response
        res.json({
            "success" : true,
            "message" : "User Created Successfully!"
        })

        
    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message" : "Internal Server Error!" 
        })
    }
}

                                            // Login function  for logging in the user
const loginUser =  async (req,res) => {


    // Destructuring the coming data
    const {email, password}  = req.body; 

    // Validating if the credentials match or not
    if(!email || !password){
        return res.json({
            "success" : false,
            "message" : "Please enter all fields!"
        })
    }


    // try catch for error handling 
    try {

        // find user (email)
        const user = await userModel.findOne({email : email})
        // found data : firstName, lastname, email, password

        // if not found sending an (error message)
        if(!user){
            return res.json({
                "success" : false,
                "message" : "User not exists!"
            })
        }

        // Comparing password (bcrypt)
        const isValidPassword = await bcrypt.compare(password,user.password)

        //if not valid sending (error)
        if(!isValidPassword){
            return res.json({
                "success" : false,
                "message" : "Password not matched!"
            })
        }   

        // token (Generate - user Data + KEY)
        const token = await jwt.sign(
            {id : user._id,isAdmin : user.isAdmin},    
            process.env.JWT_SECRET
        )

        // response (token, user data)
        res.json({
            "success" : true,
            "message" : "Login Successful!",
            "token" : token,
            "userData" : user
        })
        
    } catch (error) { // to make debug easy
        console.log(error)  
        return res.json({
            "success" : false,
            "message" : "Internal Server Error!"
        })
    }
    
}


// exporting the function
module.exports = {
    createUser,
    loginUser
}  