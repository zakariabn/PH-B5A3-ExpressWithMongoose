import { NextFunction, Request, Response } from "express";
import {
  bookQuerySchema,
  bookZodSchema,
  updateBookRequestBodyZodSchema,
} from "../validation/book.validation";
import Book from "../model/book.model";
import { isValidObjectId } from "mongoose";
import { CustomError } from "../utils/customError";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body;
    const validBookData = bookZodSchema.safeParse(body);

    if (!validBookData.success) {
      throw new CustomError(
        "Validation failed",
        400,
        validBookData.error.format()
      );
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
    throw new CustomError("Invalid request body", 400, parsed.error.format());
  }

  // Validate MongoDB ObjectId
  if (!isValidObjectId(id)) {
    throw new CustomError(`Invalid book ID: ${id}`, 400);
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
    next(error);
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

  const { filter, sortBy, sort, limit, page } = parseQueryResult.data;
  const skip = (page - 1) * limit;

  try {
    // pagination query
    const totalItems = await Book.countDocuments(); // total books
    const totalPages = Math.ceil(totalItems / limit);

    const query: Record<string, any> = {};

    if (filter) {
      query.genre = filter;
    }

    const allBooks = await Book.find(query)
      .sort({ [sortBy]: sort })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      count: allBooks.length,
      data: {
        books: allBooks,
        pagination: {
          page,
          totalPages,
          limit,
        },
      },
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

  try {
    const singleBook = await Book.getBookById(id);

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

  try {
    const deletedBookData = await Book.findByIdAndDelete(id);

    if (!deletedBookData) {
      throw new CustomError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Failed to Delete book by ID:");
    next(error);
  }
};
