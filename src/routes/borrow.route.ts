import express, { Request, Response, Router } from "express";
import { borrowBookZodSchema } from "../validation/borrow.validation";
import Book from "../model/book.model";
import Borrow from "../model/borrow.model";
import { success } from "zod/v4";

const borrowRouter: Router = express.Router();

borrowRouter.post("/", async (req: Request, res: Response): Promise<any> => {
  const validBorrowReqBody = borrowBookZodSchema.safeParse(req.body);

  if (!validBorrowReqBody.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validBorrowReqBody.error.format(),
    });
  }

  const { book: id, quantity, dueDate } = validBorrowReqBody.data;

  try {
    const borrowBook = await Book.findById(id);

    if (!borrowBook) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${id}`,
      });
    }

    if (borrowBook.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${borrowBook.copies} copies available. You requested ${quantity}.`,
      });
    }

    borrowBook.copies -= quantity;
    borrowBook.available = borrowBook.copies > 0;

    // saving updated books info
    await borrowBook.save();

    const newBorrow = await Borrow.create(validBorrowReqBody.data);
    return res.status(200).json({
      success: true,
      message: "Book borrowed successfully.",
      data: newBorrow,
    });
  } catch (error) {
    console.log("Failed while borrowing: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
});

borrowRouter.get("/", async (req: Request, res: Response) => {
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
    console.log("Failed to Retrieve borrow summary: ", error);

    // response
    res.status(500).json({
      success: false,
      message: "Failed to Retrieve borrow summary",
      error,
    });
  }
});

export default borrowRouter;
