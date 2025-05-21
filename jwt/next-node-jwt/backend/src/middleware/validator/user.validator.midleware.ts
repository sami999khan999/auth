import { NextFunction, Request, Response } from "express";
import { userRegisterFields } from "../../constants/user.constants";
import { UserRegisterType } from "../../types/users.type";
import ErrorHandler from "../../utils/errorHandler";
import { HTTP_STATUS } from "../../constants/error.constants";

// validator
export const userValidator = (
  req: Request<{}, {}, UserRegisterType>,
  res: Response,
  next: NextFunction
) => {
  if (!req.body || typeof req.body !== "object") {
    return next(
      new ErrorHandler("Body Must Be A JSON", HTTP_STATUS.BAD_REQUEST)
    );
  }

  const missingFields: string[] = [];
  const invalidFields: string[] = [];

  userRegisterFields.forEach(
    ({ field, type, required, minLength, maxLength }) => {
      const value = req.body[field];

      if (required && (value === undefined || value === null || value === "")) {
        missingFields.push(field);
      }

      if (type === "string" && typeof value !== "string") {
        invalidFields.push(`${field} should be a string`);
      }

      if (type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        invalidFields.push(`${field} should be a valid email`);
      }

      if (type === "number" && typeof value !== "number") {
        invalidFields.push(`${field} should be a number`);
      }

      if (minLength && typeof value === "string" && value.length < minLength) {
        invalidFields.push(
          `${field} should be at least ${minLength} characters`
        );
      }

      if (maxLength && typeof value === "string" && value.length > maxLength) {
        invalidFields.push(
          `${field} should be at most ${maxLength} characters`
        );
      }
    }
  );

  if (missingFields.length) {
    return next(
      new ErrorHandler(
        `Missing Fields: ${missingFields.join(", ")}`,
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  if (invalidFields.length) {
    console.log(invalidFields);
    return next(
      new ErrorHandler(
        `Validation Error: ${invalidFields.join(", ")}`,
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }

  next();
};
