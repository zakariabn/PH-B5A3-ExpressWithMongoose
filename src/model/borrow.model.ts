import mongoose, { Model, model } from "mongoose";
import { DateTime } from "luxon";
import {
  IBorrow,
  IBorrowInstanceMethod,
} from "../interfaces/borrow.interfaces";
import Book from "./book.model";
import { IBook } from "../interfaces/book.interfaces";

const defaultDue = 3;

const borrowSchema = new mongoose.Schema<
  IBorrow,
  Model<IBorrow>,
  IBorrowInstanceMethod
>(
  {
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    dueDate: {
      type: Date,
      // required: true,
      // default: () => DateTime.now().plus({ days: defaultDue }).toJSDate(),
    },
  },
  { timestamps: true, versionKey: false }
);

// --- Pre middleware
borrowSchema.pre("save", function (next) {
  if (!this.dueDate) {
    this.dueDate = DateTime.now().plus({ days: defaultDue }).toJSDate();
  }
  next();
});

// --- Post middleware
borrowSchema.post("save", function (doc, next) {
  console.log(`✅ Borrow record saved for book ID: ${doc.book}`);
  next();
});

borrowSchema.method("isOverdue", function () {
  return this.dueDate < new Date();
});

const Borrow = model("borrow", borrowSchema);
export default Borrow;
