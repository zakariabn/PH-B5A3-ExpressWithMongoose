import { Document } from "mongoose";
import { IBook } from "./book.interfaces";
import { extend } from "zod/dist/types/v4/core/util";

export interface IBorrow {
  book: string | IBook;
  quantity: number;
  dueDate: Date;
}
export interface IBorrowInstanceMethod {
  isOverdue(): boolean;
}

export interface IBorrowDocument
  extends IBorrow,
    Document,
    IBorrowInstanceMethod {}
