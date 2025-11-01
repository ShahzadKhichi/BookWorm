import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.id = decode.id;
    next();
  } catch (error) {
    console.log("Error  in auth middleware", error);
    return res.status(500).json({
      message: "internel server error",
      success: false,
    });
  }
};
