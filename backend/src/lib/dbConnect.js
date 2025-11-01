import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_URL);
    console.log(`DB Connection Successfull : ${con.connection.host}`);
  } catch (error) {
    console.error("Failed to connect DB", error);
  }
};
