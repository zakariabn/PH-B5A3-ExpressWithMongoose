import mongoose, { model, ObjectId } from "mongoose";
import {
  BookStaticMethods,
  IBook,
  IBookInstanceMethod,
} from "../interfaces/book.interfaces";

const bookSchema = new mongoose.Schema<
  IBook,
  BookStaticMethods,
  IBookInstanceMethod
>(
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
    description: { type: String },
  },
  { versionKey: false, timestamps: true }
);

bookSchema.method("isCopiesAvailable", function () {
  return this.copies > 0;
});

bookSchema.static("isCopiesAvailable", async function (bookId: string) {
  const book: IBook | null = await this.findById(bookId);

  if (book !== null) {
    return book.copies > 0;
  }
});

const Book = model<IBook, BookStaticMethods>("books", bookSchema);
export default Book;
