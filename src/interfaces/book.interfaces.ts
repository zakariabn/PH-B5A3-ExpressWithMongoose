import mongoose, { Model } from "mongoose";

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
  updateAvailability(): void;
}

// Full document (model instance)
export interface IBookDocument extends IBook, Document, IBookInstanceMethod {}

// Static methods
export interface BookStaticMethods extends Model<IBookDocument> {
  // isCopiesAvailable(): boolean;
}
