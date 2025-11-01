import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    //validation of fields
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters long",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "username should be at least 3 characters long",
      });
    }

    //check if user already exists

    const alreadyUser = await User.findOne({ $or: [{ email }, { username }] });
    if (alreadyUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.Please try different email and username",
      });
    }

    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const newUser = await User.create({
      username,
      email,
      password,
      profileImage,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    return res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt,
      },
      success: true,
      message: "Registration Successfull",
      token,
    });
  } catch (error) {
    console.log("");

    return res.status(500).json({
      message: "Internel Server error",
      error: error,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation of fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    console.log("email and password got: ", email, password);

    //check if user  exists
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("User found");

    const compare = await user.comparePassword(password);
    if (!compare) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log(process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      success: true,
      message: "Login Successfull",
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    return res.status(500).json({
      message: "Internel Server error",
      error: error?.message,
      success: false,
    });
  }
};
