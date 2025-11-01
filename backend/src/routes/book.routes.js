import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deleteBook,
  getAllBooks,
  recomendedBooks,
} from "../controllers/book.controller.js";
const router = express.Router();

router.post("/", auth, createPost);
router.get("/", auth, getAllBooks);
router.delete("/:id", auth, deleteBook);
router.get("/user", auth, recomendedBooks);

export default router;
