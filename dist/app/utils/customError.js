"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
// utils/AppError.ts
class CustomError extends Error {
    constructor(message, statusCode = 400, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
