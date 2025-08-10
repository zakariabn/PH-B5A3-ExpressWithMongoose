"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.getSingleBookById = exports.getAllBooks = exports.updateBook = exports.createBook = void 0;
const book_validation_1 = require("../validation/book.validation");
const book_model_1 = __importDefault(require("../model/book.model"));
const mongoose_1 = require("mongoose");
const customError_1 = require("../utils/customError");
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const validBookData = book_validation_1.bookZodSchema.safeParse(body);
        if (!validBookData.success) {
            throw new customError_1.CustomError("Validation failed", 400, validBookData.error.format());
        }
        const books = yield book_model_1.default.create(validBookData.data);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: books,
        });
    }
    catch (error) {
        console.log("Failed to create book");
        next(error);
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id: id } = req.params;
    // Validate request body
    const parsed = book_validation_1.updateBookRequestBodyZodSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new customError_1.CustomError("Invalid request body", 400, parsed.error.format());
    }
    // Validate MongoDB ObjectId
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw new customError_1.CustomError(`Invalid book ID: ${id}`, 400);
    }
    const { copies } = parsed.data;
    try {
        const updatedBook = yield book_model_1.default.findByIdAndUpdate(id, { $set: { copies, available: copies > 0 } }, { new: true });
        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: `Book with ID ${id} not found`,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        console.error("Error updating book");
        next(error);
    }
});
exports.updateBook = updateBook;
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // validating query
    const parseQueryResult = book_validation_1.bookQuerySchema.safeParse(req.query);
    if (!parseQueryResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: parseQueryResult.error.format(),
        });
        return;
    }
    const { filter, sortBy, sort, limit, page } = parseQueryResult.data;
    const skip = (page - 1) * limit;
    try {
        // pagination query
        const totalItems = yield book_model_1.default.countDocuments(); // total books
        const totalPages = Math.ceil(totalItems / limit);
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const allBooks = yield book_model_1.default.find(query)
            .sort({ [sortBy]: sort })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            count: allBooks.length,
            data: {
                books: allBooks,
                pagination: {
                    page,
                    totalPages,
                    limit,
                },
            },
        });
    }
    catch (error) {
        console.error("Failed to get all books:");
        next(error);
    }
});
exports.getAllBooks = getAllBooks;
const getSingleBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id: id } = req.params;
    try {
        const singleBook = yield book_model_1.default.getBookById(id);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: singleBook,
        });
    }
    catch (error) {
        console.error("Failed to fetch book by ID");
        next(error);
    }
});
exports.getSingleBookById = getSingleBookById;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id: id } = req.params;
    try {
        const deletedBookData = yield book_model_1.default.findByIdAndDelete(id);
        if (!deletedBookData) {
            throw new customError_1.CustomError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Failed to Delete book by ID:");
        next(error);
    }
});
exports.deleteBook = deleteBook;
