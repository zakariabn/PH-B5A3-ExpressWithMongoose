import { Response } from "express";

// utils/sendResponse.ts
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  {
    success,
    message,
    data,
    errors,
  }: {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
  }
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
    ...(errors && { errors }),
  });
};
