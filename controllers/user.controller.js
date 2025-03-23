const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateToken } = require("../helpers/jwtHelpers");


exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const data = {
      fullName,
        email,
        password,
    };

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(409).send("User already exists");
    }

    const user = new User(data);
    await user.save();
    
    res.status(200).send({
      status: "Success",
      message: "Successfully signed up",
      data: user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      status: "fail",
      message: "Error during signup",
      error: error.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both email and password.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // Generate JWT token (assuming you have a function to generate it)
    const accessToken = generateToken(user);

    // Set cookie options
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production", // Secure in production only
      httpOnly: true, // Prevent access from client-side JavaScript
      sameSite: "strict", // Prevent CSRF attacks
    };
    res.cookie("accessToken", accessToken, cookieOptions);

    // Send success response
    res.status(200).json({
      status: "Success",
      message: "Logged in successfully.",
      data: { accessToken, user },
    });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({
      status: "fail",
      message: "An error occurred during login.",
      error: error.message,
    });
  }
};

