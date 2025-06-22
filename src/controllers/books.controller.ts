import { NextFunction, Request, Response } from "express";
import {
  bookQuerySchema,
  bookZodSchema,
  updateBookRequestBodyZodSchema,
} from "../validation/book.validation";
import Book from "../model/book.model";
import { isValidObjectId } from "mongoose";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;
    const validBookData = bookZodSchema.safeParse(body);

    if (!validBookData.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errorFrom: validBookData.error.name,
        errors: validBookData.error.format(),
      });
      return;
    }

    const books = await Book.create(validBookData.data);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: books,
    });
  } catch (error) {
    console.log("Failed to create book");
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { book_id: id } = req.params;

  // Validate request body
  const parsed = updateBookRequestBodyZodSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid request body",
      errors: parsed.error.format(),
    });
    return;
  }

  // Validate MongoDB ObjectId
  if (!isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: `Invalid book ID: ${id}`,
    });
    return;
  }

  const { copies } = parsed.data;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: { copies, available: copies > 0 } },
      { new: true }
    );

    if (!updatedBook) {
      res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book");
    next(error); // Let your global error handler catch this
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // validating query
  const parseQueryResult = bookQuerySchema.safeParse(req.query);
  if (!parseQueryResult.success) {
    res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: parseQueryResult.error.format(),
    });
    return;
  }
  const { filter, sortBy, sort, limit } = parseQueryResult.data;

  try {
    const query: Record<string, any> = {};

    if (filter) {
      query.genre = filter;
    }

    const allBooks = await Book.find(query)
      .sort({ [sortBy]: sort })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      count: allBooks.length,
      data: allBooks,
    });
  } catch (error) {
    console.error("Failed to get all books:");
    next(error);
  }
};

export const getSingleBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { book_id: id } = req.params;

  // Check for valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: `"${id}" is not a valid ObjectId.`,
    });
    return;
  }

  try {
    const singleBook = await Book.findById(id);

    if (!singleBook) {
      res.status(404).json({
        success: false,
        message: `Book with id "${id}" not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: singleBook,
    });
  } catch (error) {
    console.error("Failed to fetch book by ID");
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { book_id: id } = req.params;

  // Check for valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: `${id} is not a valid ObjectId.`,
    });
    return;
  }

  try {
    const deletedBookData = await Book.findByIdAndDelete(id);

    if (!deletedBookData) {
      res.status(200).json({
        success: false,
        message: `Book not found with id: ${id}`,
        data: deletedBookData,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBookData,
    });
  } catch (error) {
    console.error("Failed to Delete book by ID:");
    next(error);
  }
};
