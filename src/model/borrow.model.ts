import mongoose, { model } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interfaces";
import { DateTime } from "luxon";

const defaultDue: number = 3;

const borrowSchema = new mongoose.Schema<IBorrow>(
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
      required: true,
      default: () => DateTime.now().plus({ days: defaultDue }).toJSDate(),
    },
  },
  { timestamps: true, versionKey: false }
);

const Borrow = model("borrow", borrowSchema);
export default Borrow;
