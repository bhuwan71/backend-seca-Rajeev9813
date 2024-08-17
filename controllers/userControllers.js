//Importing the neccessary dependencies
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel"); //importing user model
const jwt = require("jsonwebtoken");
const createUser = async (req, res) => {
  // Destructure the incoming data
  const { firstName, lastName, email, password } = req.body;

  // Validating the data (if empty, stop the process and send response)
  if (!firstName || !lastName || !email || !password) {
    // res.send("Please enter all fields!")
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  // 4. Error Handling by Try Catch
  try {
    // Checking if the user is already registered
    const existingUser = await userModel.findOne({ email: email });

    //  if user found: Send response
    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exists!",
      });
    }

    // Hashing/Encryption of the password using randomsalt and bcrypt
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    //  if user is new
    const newUser = new userModel({
      //format is  Database Fields : Client's Value
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    // Saving to database
    await newUser.save();

    // sending the response
    res.json({
      success: true,
      message: "User Created Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }

    // If updating password, hash the new password
    let updatedPassword = user.password;
    if (password) {
      const randomSalt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, randomSalt);
    }

    // Update user details
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        password: updatedPassword,
      },
      { new: true }
    );

    // Send the updated user as the response
    res.json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Login function  for logging in the user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not exists!",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect!",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful!",
      token: token,
      userData: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};


const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find user by ID
    const user = await userModel.findById(id).select("-password"); // Exclude the password field

    // Check if user exists
    if (!user) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }

    // Send the user as the response
    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users excluding admins
    const users = await userModel.find({ isAdmin: false }).select("-password"); // Exclude the password field

    // Check if users exist
    if (!users.length) {
      return res.json({
        success: false,
        message: "No users found!",
      });
    }

    // Send the retrieved users as the response
    res.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await userModel.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }

    // Delete the user
    await userModel.findByIdAndDelete(id);

    // Send response
    res.json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// exporting the function
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getSingleUser,
};
