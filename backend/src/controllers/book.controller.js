// import cloudinary from "../lib/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import Book from "../models/Book.js";

export const createPost = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // console.log("cloud name : ",process.env.CLOUDINARY_CLOUD_NAME);
    //   console.log("api key : ", process.env.CLOUDINARY_API_KEY);
    //     console.log("api secret : ", process.env.CLOUDINARY_API_SECRET);

    const uploadRes = await cloudinary.uploader.upload(image);
    const imageUrl = uploadRes.secure_url;

    const newBook = Book.create({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.id,
    });

    return res.status(201).json({
      success: true,
      newBook,
      message: "Post created Successfully",
    });
  } catch (error) {
    console.log("Error in create post controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internel Server error" });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage")
      .exec();

    const totalBooks = await Book.countDocuments();

    return res.status(200).json({
      books,
      currenPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in getting all books controller", error);

    return res.status(500).json({
      message: "internel server error",
      success: false,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const book = await Book.findOne({ _id: bookId, user: req.id });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
        success: false,
      });
    }

    //deleting image from cloud

    try {
      const publicId = book.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      console.log("image of book deleted ");
    } catch (error) {
      console.log("error in deleting book image from cloud");
    }

    await book.deleteOne();

    return res.status(200).json({
      message: "Book deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in delete book controller", error);
    return res.status(500).json({
      success: false,
      message: "internel server error",
    });
  }
};

export const recomendedBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;

    const skip = (page - 1) * limit;

    const books = await Book.find({ user: req.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalBooks = await Book.countDocuments({ user: req.id });

    return res.json({
      totalBooks,
      books,
      success: false,
    });
  } catch (error) {
    console.error("Error in recomended books controller", error);
    return res.status(500).json({
      message: "internel server error",
      success: false,
    });
  }
};
