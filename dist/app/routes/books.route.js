"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("../controllers/books.controller");
// defining router
const bookRouter = express_1.default.Router();
// post or new book add route
bookRouter.post("/", books_controller_1.createBook);
// update books copies with book id
bookRouter.put("/:book_id", books_controller_1.updateBook);
// get all books with filtering support
bookRouter.get("/", books_controller_1.getAllBooks);
// get single book by id
bookRouter.get("/:book_id", books_controller_1.getSingleBookById);
// delete a book by id
bookRouter.delete("/:book_id", books_controller_1.deleteBook);
exports.default = bookRouter;
