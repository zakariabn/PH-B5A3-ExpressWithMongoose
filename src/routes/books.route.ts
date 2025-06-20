import express, { Request, Response, Router } from "express";
import Book from "../model/book.model";
import { isValidObjectId } from "mongoose";
import { IResponseError } from "../interfaces/error.interfaces";
import {
  bookQuerySchema,
  bookZodSchema,
  updateBookRequestBodyZodSchema,
} from "../validation/book.validation";
import { error } from "console";

// defining router
const bookRouter: Router = express.Router();

// post or new book add route
bookRouter.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body;
    const validBookData = bookZodSchema.safeParse(body);

    if (!validBookData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errorFrom: validBookData.error.name,
        errors: validBookData.error.format(),
      });
    }

    const books = await Book.create(validBookData.data);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: books,
    });
  } catch (error: any) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: {
          name: error.name,
          errors: error.errors,
        },
      });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists.`,
        error: {
          name: "DuplicateKeyError",
          field,
          value: error.keyValue[field],
        },
      });
    }

    // Fallback for unknown errors
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error,
    });
  }
});

// update books copies with book id
bookRouter.patch(
  "/:book_id",
  async (req: Request, res: Response): Promise<any> => {
    const { book_id: id } = req.params;
    const body = req.body;

    // Checking if body exist and and expected body
    const validBody = updateBookRequestBodyZodSchema.safeParse(body);

    if (!validBody.success) {
      return res.status(400).json({
        success: false,
        message: `Unexpected body`,
        errors: validBody.error.format(),
      });
    }

    // Check for valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: `${id} is not a valid ObjectId.`,
      });
    }

    try {
      const singleBook = await Book.findByIdAndUpdate(
        id,
        { $set: { copies: body.copies } },
        { new: true }
      );

      console.log(singleBook);

      if (!singleBook) {
        return res.status(404).json({
          success: false,
          message: `Book with id ${id} not found.`,
        });
      }

      return res.status(203).json({
        success: true,
        message: "Book updated successfully",
        data: singleBook,
      });
    } catch (error) {
      console.error("Failed to Update book by ID:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

// get all books with filtering support
bookRouter.get("/", async (req: Request, res: Response): Promise<any> => {
  // validating query
  const parseQueryResult = bookQuerySchema.safeParse(req.query);
  if (!parseQueryResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: parseQueryResult.error.format(),
    });
  }
  const {
    filter,
    sortBy = "updatedAt",
    sort = "desc",
    limit = 0,
  } = parseQueryResult.data;

  try {
    const query: Record<string, any> = {};

    if (filter) {
      query.genre = filter;
    }

    const allBooks = await Book.find(query).sort({ sortBy: sort }).limit(limit);

    res.status(200).json({
      success: true,
      count: allBooks.length,
      data: allBooks,
    });
  } catch (error) {
    console.error("Failed to get all books:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve books. Please try again later.",
    });
  }
});

// get single book by id
bookRouter.get("/:book_id", async (req: Request, res: Response) => {
  const { book_id: id } = req.params;

  // Check for valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: `"${id}" is not a valid ObjectId.`,
    });
  }

  try {
    const singleBook = await Book.findById(id);

    if (!singleBook) {
      res.status(404).json({
        success: false,
        message: `Book with id "${id}" not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: singleBook,
    });
  } catch (error) {
    console.error("Failed to fetch book by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export default bookRouter;
