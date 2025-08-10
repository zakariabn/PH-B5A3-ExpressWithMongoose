"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const customError_1 = require("../utils/customError");
const borrow_model_1 = __importDefault(require("./borrow.model"));
const bookSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
        type: String,
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        required: true,
    },
    available: { type: Boolean, default: true },
    copies: { type: Number, min: 0, required: true },
    isbn: { type: String, unique: true, required: true },
    description: { type: String, default: "" },
}, { versionKey: false, timestamps: true });
// when a book deleted all borrow of this book also delete form borrow collection
bookSchema.post("findOneAndDelete", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            const deletedBookId = doc._id;
            console.log("Book deleted with ID:", deletedBookId);
            // Now delete related borrows
            yield borrow_model_1.default.deleteMany({ book: deletedBookId });
        }
        next();
    });
});
bookSchema.static("getBookById", function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isValidId = (0, mongoose_1.isValidObjectId)(id);
        if (!isValidId) {
            throw new customError_1.CustomError("Invalid Object ID", 400);
        }
        const book = yield this.findById(id);
        console.log(book);
        if (book) {
            return book;
        }
        else {
            throw new customError_1.CustomError("Book Not Found", 404);
        }
    });
});
bookSchema.method("updateAvailability", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const isAvailable = this.copies > 0;
        this.available = isAvailable;
        // await this.save();
    });
});
const Book = (0, mongoose_1.model)("books", bookSchema);
exports.default = Book;
