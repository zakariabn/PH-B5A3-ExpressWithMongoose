import express, { Router } from "express";

import {
  createBook,
  deleteBook,
  getAllBooks,
  getSingleBookById,
  updateBook,
} from "../controllers/books.controller";

// defining router
const bookRouter: Router = express.Router();

// post or new book add route
bookRouter.post("/", createBook);

// update books copies with book id
bookRouter.put("/:book_id", updateBook);

// get all books with filtering support
bookRouter.get("/", getAllBooks);

// get single book by id
bookRouter.get("/:book_id", getSingleBookById);

// delete a book by id
bookRouter.delete("/:book_id", deleteBook);

export default bookRouter;
