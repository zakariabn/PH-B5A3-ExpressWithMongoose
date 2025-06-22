import mongoose, { model, ObjectId } from "mongoose";
import {
  BookStaticMethods,
  IBookDocument,
} from "../interfaces/book.interfaces";

const bookSchema = new mongoose.Schema<
  IBookDocument, // document type (with instance methods)
  BookStaticMethods // static methods
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

bookSchema.method("updateAvailability", async function () {
  const isAvailable = this.copies > 0;
  this.available = isAvailable;
  // await this.save();
});

const Book = model<IBookDocument, BookStaticMethods>("books", bookSchema);
export default Book;
