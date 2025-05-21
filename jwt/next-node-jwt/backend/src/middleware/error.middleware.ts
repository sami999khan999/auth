import { NextFunction, Request, Response } from "express";

// middleware

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
};

export default errorHandler;
