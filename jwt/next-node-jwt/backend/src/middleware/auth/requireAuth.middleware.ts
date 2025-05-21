import { HTTP_STATUS } from "../../constants/error.constants";
import { reIssueTokens } from "../../services/auth.services";
import { setAuthCookies } from "../../utils/cookies";
import ErrorHandler from "../../utils/errorHandler";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/token";
import { asyncMiddleware } from "../anync.middleware";

export const requireAuth = asyncMiddleware(async (req, res, next) => {
  const access_token = req.cookies["access_token"];
  const refresh_token = req.cookies["refresh_token"];

  console.log("refresh: ", refresh_token);
  console.log("access: ", access_token);

  if (access_token) {
    verifyAccessToken(access_token);

    return next();
  }

  if (refresh_token) {
    const payload = verifyRefreshToken(refresh_token);

    const { newAccessToken, newRefreshToken } = await reIssueTokens(
      payload.id,
      refresh_token,
      req
    );

    setAuthCookies(newAccessToken, newRefreshToken, res);

    return next();
  }

  throw new ErrorHandler(
    "Unauthorized: Access And Refresh Tokens Are Missing",
    HTTP_STATUS.UNAUTHORIZED
  );
});
