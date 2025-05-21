import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/error.constants";
import { reIssueTokens } from "../../services/auth.services";
import { setAuthCookies } from "../../utils/cookies";
import ErrorHandler from "../../utils/errorHandler";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/token";
import { asyncMiddleware } from "../anync.middleware";

function assertAdmin(role: string | null) {
  if (role !== "ADMIN") {
    throw new ErrorHandler(
      "Unauthorized: Admin access required",
      HTTP_STATUS.UNAUTHORIZED
    );
  }
}

export const adminOnly = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refresh_token"];
    const accessToken = req.cookies["access_token"];

    if (accessToken) {
      const payload = verifyAccessToken(accessToken);

      console.log(payload);

      if (payload) {
        assertAdmin(payload.role);
        return next();
      }
    }

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);

      assertAdmin(payload.role);

      const { newAccessToken, newRefreshToken } = await reIssueTokens(
        payload.id,
        refreshToken,
        req
      );

      setAuthCookies(newAccessToken, newRefreshToken, res);

      return next();
    }

    return next(
      new ErrorHandler(
        "Unauthorized: Access And Refresh Tokens Are Missing",
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }
);
