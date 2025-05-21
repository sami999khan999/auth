import { Response } from "express";
import {
  ACCESS_TOKEN_EXPIRY_MILLISECONDS,
  REFRESH_TOKEN_EXPIRY_MILLISECONDS,
} from "../constants/token.constants";
import ErrorHandler from "./errorHandler";

export const cookieOptions = (maxAge: number) => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
  };
};

export const setAuthCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  try {
    res
      .cookie(
        "access_token",
        accessToken,
        cookieOptions(ACCESS_TOKEN_EXPIRY_MILLISECONDS)
      )
      .cookie(
        "refresh_token",
        refreshToken,
        cookieOptions(REFRESH_TOKEN_EXPIRY_MILLISECONDS)
      );
  } catch (err) {
    console.log(err);
    throw new ErrorHandler("Failed to set auth cookies", 500);
  }
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("access_token").clearCookie("refresh_token");
};
