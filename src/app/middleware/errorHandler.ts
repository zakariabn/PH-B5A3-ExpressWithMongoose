import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CustomError } from "../interfaces/error.interfaces";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: Record<string, string | any> = {};

  // Mongoose validation error
  if (
    err.name === "ValidationError" &&
    err instanceof mongoose.Error.ValidationError
  ) {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = Object.keys(err.errors).reduce(
      (acc: Record<string, string>, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      },
      {}
    );
  }

  // Mongoose duplicate key error
  else if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    message = "Duplicate field value";
    errorDetails = err.keyValue;
  }

  // Mongoose cast error (invalid ObjectId)
  else if (
    err.name === "CastError" &&
    err instanceof mongoose.Error.CastError
  ) {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
    errorDetails = { [err.path!]: `Invalid value: ${err.value}` };
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

export default errorHandler;
