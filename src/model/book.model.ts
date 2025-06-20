import mongoose, { model } from "mongoose";
import { IBook } from "../interfaces/book.interfaces";

const bookSchema = new mongoose.Schema<IBook>(
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
    isbn: { type: Number, unique: true, required: true },
    description: { type: String },
  },
  { versionKey: false, timestamps: true }
);

const Book = model("books", bookSchema);
export default Book;
