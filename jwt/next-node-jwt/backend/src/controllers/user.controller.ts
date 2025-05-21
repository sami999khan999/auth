import { Request } from "express";
import { asyncMiddleware } from "../middleware/anync.middleware";
import { issueTokens, revokeToken } from "../services/auth.services";
import { login, register } from "../services/user.services";
import { LoginUserType, UserRegisterType } from "../types/users.type";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";

// controller

export const userRegister = asyncMiddleware(
  async (req: Request<{}, {}, UserRegisterType>, res, next) => {
    const { name, email, password } = req.body;

    const dbUser = await register({ name, email, password });

    const { accessToken, refreshToken, dbRefreshToken } = await issueTokens(
      dbUser,
      req
    );

    setAuthCookies(accessToken, refreshToken, res);

    res.status(200).json({
      user: dbUser,
      refreshToken: dbRefreshToken,
    });
  }
);

export const userLogin = asyncMiddleware(
  async (req: Request<{}, {}, LoginUserType>, res, next) => {
    const { email, password } = req.body;

    const dbUser = await login(email, password);

    const { accessToken, refreshToken, dbRefreshToken } = await issueTokens(
      dbUser!,
      req
    );

    setAuthCookies(accessToken, refreshToken, res);

    res.status(200).json({ user: dbUser, refreshToken: dbRefreshToken });
  }
);

export const userLogout = asyncMiddleware(async (req, res, next) => {
  await revokeToken(req);

  clearAuthCookies(res);

  res.status(200).json({ message: "Successfully logged out" });
});

export const userProfile = asyncMiddleware(async (req, res, next) => {
  res.status(200).json({ hello: "From User Profile" });
});

export const adminDashboard = asyncMiddleware(async (req, res, next) => {
  res.status(200).json({ hello: "From Admin Dashboard" });
});
