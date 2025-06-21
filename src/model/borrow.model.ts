import mongoose, { model } from "mongoose";
import { DateTime } from "luxon";
import { IBorrow } from "../interfaces/borrow.interfaces";

const defaultDue = 3;

// --- Extend for instance method
export interface IBorrowDocument extends IBorrow, mongoose.Document {
  isOverdue(): boolean;
}

// --- Extend for static method
export interface IBorrowModel extends mongoose.Model<IBorrowDocument> {
  findByBook(bookId: string): Promise<IBorrowDocument[]>;
}

const borrowSchema = new mongoose.Schema<IBorrowDocument, IBorrowModel>(
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

// --- Static method
borrowSchema.statics.findByBook = function (bookId: string) {
  return this.find({ book: bookId });
};

// --- Instance method
borrowSchema.methods.isOverdue = function () {
  return DateTime.now() > DateTime.fromJSDate(this.dueDate);
};

// --- Final model export
const Borrow = model<IBorrowDocument, IBorrowModel>("borrow", borrowSchema);
export default Borrow;
