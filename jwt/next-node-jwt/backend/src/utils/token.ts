import jwt from "jsonwebtoken";
import ErrorHandler from "./errorHandler";
import { HTTP_STATUS } from "../constants/error.constants";
import {
  ACCESS_TOKEN_EXPIRY_MILLISECONDS,
  REFRESH_TOKEN_EXPIRY_MILLISECONDS,
} from "../constants/token.constants";
import { UserJwtPayload } from "../types/users.type";
import { RefreshTokenPayloadType } from "../types/tokens.type";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const signAccessToken = (payload: RefreshTokenPayloadType) => {
  try {
    return jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRY_MILLISECONDS}ms`,
    });
  } catch (err: any) {
    throw new ErrorHandler(
      "Registered Successfully But Failed To Sign Access Token, Try Logging in",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const signRefreshToken = (payload: RefreshTokenPayloadType) => {
  try {
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRY_MILLISECONDS}ms`,
    });
  } catch (err) {
    throw new ErrorHandler(
      "Registered Successfully But Failed To Sign Refresh Token, Try Logging in",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);

    if (
      typeof payload !== "object" ||
      !payload ||
      !("id" in payload) ||
      !("email" in payload) ||
      !("name" in payload) ||
      !("role" in payload) ||
      !("iat" in payload) ||
      !("exp" in payload)
    ) {
      throw new ErrorHandler("Invalid token payload", HTTP_STATUS.UNAUTHORIZED);
    }

    return payload as UserJwtPayload;
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Failed To Verify Access Token",
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);

    if (
      typeof payload !== "object" ||
      !payload ||
      !("id" in payload) ||
      !("email" in payload) ||
      !("name" in payload) ||
      !("role" in payload) ||
      !("iat" in payload) ||
      !("exp" in payload)
    ) {
      throw new ErrorHandler("Invalid token payload", HTTP_STATUS.UNAUTHORIZED);
    }

    return payload as UserJwtPayload;
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Failed To Verify Refresh Token",
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }
};
