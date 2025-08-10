import { NextFunction, Request, Response } from "express";
import Borrow from "../model/borrow.model";
import Book from "../model/book.model";
import { borrowBookZodSchema } from "../validation/borrow.validation";
import { CustomError } from "../utils/customError";

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validBorrowReqBody = borrowBookZodSchema.safeParse(req.body);

  if (!validBorrowReqBody.success) {
    throw new CustomError(
      "Validation failed",
      400,
      validBorrowReqBody.error.format()
    );
  }

  const { book: id, quantity, dueDate } = validBorrowReqBody.data;

  try {
    const borrowBook = await Book.findById(id);

    if (!borrowBook) {
      throw new CustomError("Book not found with id: ${id}", 404);
    }

    if (borrowBook.copies < quantity) {
      throw new CustomError(
        `Only ${borrowBook.copies} copies available. You requested ${quantity}.`,
        400
      );
    }

    borrowBook.copies -= quantity;
    borrowBook.updateAvailability();
    await borrowBook.save();

    // const newBorrow = await Borrow.create(validBorrowReqBody.data);
    const newBorrow = new Borrow(validBorrowReqBody.data);
    await newBorrow.save();

    res.status(200).json({
      success: true,
      message: "Book borrowed successfully.",
      data: newBorrow,
    });
  } catch (error) {
    console.log("Failed while borrowing:");
    next(error);
  }
};

export const summary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          "book.title": 1,
          "book.isbn": 1,
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Summary retrieve successfully",
      data: summary,
    });
  } catch (error) {
    console.log("Failed to Retrieve borrow summary: ");
    next(error);
  }
};
