import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;
  errors: [];

  constructor(message: string, statusCode: number = 400, errors = undefined) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors || [];
  }
}

export const handleError = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status_code: error.statusCode,
      message: error.message,
      errors: error.errors.length > 0 ? error.errors : undefined,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};
