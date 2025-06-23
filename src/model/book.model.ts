import mongoose, { isValidObjectId, model } from "mongoose";
import {
  IBookDocument,
  BookStaticMethods,
} from "../interfaces/book.interfaces";
import { success } from "zod/v4";
import { CustomError } from "../utils/customError";
import Borrow from "./borrow.model";

const bookSchema = new mongoose.Schema<IBookDocument>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true,
    },
    available: { type: Boolean, default: true },
    copies: { type: Number, min: 0, required: true },
    isbn: { type: String, unique: true, required: true },
    description: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

// when a book deleted all borrow of this book also delete form borrow collection
bookSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    const deletedBookId = doc._id;
    console.log("Book deleted with ID:", deletedBookId);

    // Now delete related borrows
    await Borrow.deleteMany({ book: deletedBookId });
  }
  next();
});

bookSchema.static("getBookById", async function (id: string) {
  const isValidId = isValidObjectId(id);

  if (!isValidId) {
    throw new CustomError("Invalid Object ID", 400);
  }

  const book = await this.findById(id);
  console.log(book);

  if (book) {
    return book;
  } else {
    throw new CustomError("Book Not Found", 404);
  }
});

bookSchema.method("updateAvailability", async function () {
  const isAvailable = this.copies > 0;
  this.available = isAvailable;
  // await this.save();
});

const Book = model<IBookDocument, BookStaticMethods>("books", bookSchema);
export default Book;
