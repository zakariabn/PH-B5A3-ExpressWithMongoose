import { Model } from "mongoose";

export type Genre =
  | "FICTION"
  | "NON_FICTION"
  | "SCIENCE"
  | "HISTORY"
  | "BIOGRAPHY"
  | "FANTASY";

export interface IBook {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  copies: number;
  description?: string;
  available: boolean;
}

export interface IBookInstanceMethod {
  isCopiesAvailable(): boolean;
}

export interface BookStaticMethods extends Model<IBook> {
  isCopiesAvailable(): boolean;
}
