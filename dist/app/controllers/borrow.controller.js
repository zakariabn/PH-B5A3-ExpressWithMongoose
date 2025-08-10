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
exports.summary = exports.borrowBook = void 0;
const borrow_model_1 = __importDefault(require("../model/borrow.model"));
const book_model_1 = __importDefault(require("../model/book.model"));
const borrow_validation_1 = require("../validation/borrow.validation");
const customError_1 = require("../utils/customError");
const borrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validBorrowReqBody = borrow_validation_1.borrowBookZodSchema.safeParse(req.body);
    if (!validBorrowReqBody.success) {
        throw new customError_1.CustomError("Validation failed", 400, validBorrowReqBody.error.format());
    }
    const { book: id, quantity, dueDate } = validBorrowReqBody.data;
    try {
        const borrowBook = yield book_model_1.default.findById(id);
        if (!borrowBook) {
            throw new customError_1.CustomError("Book not found with id: ${id}", 404);
        }
        if (borrowBook.copies < quantity) {
            throw new customError_1.CustomError(`Only ${borrowBook.copies} copies available. You requested ${quantity}.`, 400);
        }
        borrowBook.copies -= quantity;
        borrowBook.updateAvailability();
        yield borrowBook.save();
        // const newBorrow = await Borrow.create(validBorrowReqBody.data);
        const newBorrow = new borrow_model_1.default(validBorrowReqBody.data);
        yield newBorrow.save();
        res.status(200).json({
            success: true,
            message: "Book borrowed successfully.",
            data: newBorrow,
        });
    }
    catch (error) {
        console.log("Failed while borrowing:");
        next(error);
    }
});
exports.borrowBook = borrowBook;
const summary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.default.aggregate([
            {
                $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    _id: 0,
                    "book.title": 1,
                    "book.isbn": 1,
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Summary retrieve successfully",
            data: summary,
        });
    }
    catch (error) {
        console.log("Failed to Retrieve borrow summary: ");
        next(error);
    }
});
exports.summary = summary;
