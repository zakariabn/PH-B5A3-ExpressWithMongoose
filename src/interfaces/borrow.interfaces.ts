import { IBook } from "./book.interfaces";

export interface IBorrow {
  book: string | IBook;
  quantity: number;
  dueDate: Date;
}
