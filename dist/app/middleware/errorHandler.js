"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res, next) => {
    console.error(err);
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorDetails = {};
    // Mongoose validation error
    if (err.name === "ValidationError" &&
        err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = "Validation failed";
        errorDetails = Object.keys(err.errors).reduce((acc, key) => {
            acc[key] = err.errors[key].message;
            return acc;
        }, {});
    }
    // Mongoose duplicate key error
    else if (err.code === 11000 && err.keyValue) {
        statusCode = 409;
        message = "Duplicate field value";
        errorDetails = err.keyValue;
    }
    // Mongoose cast error (invalid ObjectId)
    else if (err.name === "CastError" &&
        err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Invalid value for field: ${err.path}`;
        errorDetails = { [err.path]: `Invalid value: ${err.value}` };
    }
    // Custom thrown error
    else if (err.statusCode && err.message) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errors || {};
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: errorDetails,
    });
};
exports.default = errorHandler;
