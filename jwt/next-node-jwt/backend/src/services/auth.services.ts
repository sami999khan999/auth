import bcrypt from "bcrypt";
import { Request } from "express";
import { HTTP_STATUS } from "../constants/error.constants";
import { RegisteredUserType } from "../types/users.type";
import ErrorHandler from "../utils/errorHandler";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import {
  getRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
} from "./toke.services";
import { getUser } from "./user.services";

//services

export const issueTokens = async (user: RegisteredUserType, req: Request) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const ipAddress = req.ip || "";
  const userAgent = req.headers["user-agent"] || "";

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const dbRefreshToken = await saveRefreshToken({
    userId: user.id,
    ipAddress: ipAddress,
    token: refreshToken,
    userAgent: userAgent,
  });

  return { accessToken, refreshToken, dbRefreshToken };
};

export const reIssueTokens = async (
  userId: string,
  refreshToken: string,
  req: Request
) => {
  const ipAddress = req.ip || "";
  const userAgent = req.headers["user-agent"] || "";

  const dbRefreshToken = await getRefreshToken(userId, ipAddress, userAgent);

  if (dbRefreshToken.is_revoked) {
    throw new ErrorHandler(
      "Unauthorized: Refresh Token Revoked",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (dbRefreshToken.expires_at < new Date()) {
    throw new ErrorHandler(
      "Unauthorized: Refresh Token Expired",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const isValidToken = await bcrypt.compare(
    refreshToken,
    dbRefreshToken.token_hash
  );

  if (!isValidToken) {
    throw new ErrorHandler(
      "Unauthorized: Invalid Refresh Token",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const user = await getUser(userId);

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const newRefreshToken = signRefreshToken(payload);
  const newAccessToken = signAccessToken(payload);

  await saveRefreshToken({
    userId: user.id,
    ipAddress: ipAddress,
    token: newRefreshToken,
    userAgent: userAgent,
  });

  return { newAccessToken, newRefreshToken };
};

export const revokeToken = async (req: Request) => {
  const ipAddress = req.ip || "";
  const userAgent = req.headers["user-agent"] || "";
  const refreshToken = req.cookies["refresh_token"];

  const payload = verifyRefreshToken(refreshToken);

  const dbRefreshToken = await getRefreshToken(
    payload.id,
    ipAddress,
    userAgent
  );

  const isValidToken = await bcrypt.compare(
    refreshToken,
    dbRefreshToken.token_hash
  );

  if (!isValidToken) {
    throw new ErrorHandler(
      "Unauthorized: Invalid Refresh Token",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  await revokeRefreshToken(payload.id, ipAddress, userAgent);
};
