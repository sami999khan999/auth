import { HTTP_STATUS } from "../constants/error.constants";
import { RefreshTokensType } from "../types/tokens.type";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errorHandler";
import { RefreshTokensTable } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { REFRESH_TOKEN_EXPIRY_MILLISECONDS } from "../constants/token.constants";
import { and, eq } from "drizzle-orm";

//services

export const saveRefreshToken = async ({
  userId,
  token,
  userAgent,
  ipAddress,
}: RefreshTokensType) => {
  let hashedToken;

  try {
    hashedToken = await bcrypt.hash(token, 10);
  } catch (err) {
    throw new ErrorHandler(
      "Failed To Hash Token",
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MILLISECONDS);

  try {
    const [refreshToken] = await db
      .insert(RefreshTokensTable)
      .values({
        user_id: userId,
        token_hash: hashedToken,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: expiresAt,
      })
      .onConflictDoUpdate({
        target: [
          RefreshTokensTable.user_id,
          RefreshTokensTable.user_agent,
          RefreshTokensTable.ip_address,
        ],
        set: {
          token_hash: hashedToken,
          expires_at: expiresAt,
          is_revoked: false,
        },
      })
      .returning({
        id: RefreshTokensTable.id,
        user_id: RefreshTokensTable.user_id,
        expires_at: RefreshTokensTable.expires_at,
      });

    return refreshToken;
  } catch (err) {
    throw new ErrorHandler(
      "Failed To Save Refresh Token To The DB",
      HTTP_STATUS.CONFLICT
    );
  }
};

export const getRefreshToken = async (
  userId: string,
  ip: string,
  userAgent: string
) => {
  try {
    const refreshToken = await db.query.RefreshTokensTable.findFirst({
      where: and(
        eq(RefreshTokensTable.user_id, userId),
        eq(RefreshTokensTable.ip_address, ip),
        eq(RefreshTokensTable.user_agent, userAgent)
      ),
    });

    if (!refreshToken) {
      throw new ErrorHandler(
        "Unauthorized: Session Does Not Exist",
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    return refreshToken;
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    }

    throw new ErrorHandler(
      "Could Not Retrieve Refresh Token From The Database",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteRefreshToken = async (tokenId: string) => {
  try {
    const [refreshToken] = await db
      .delete(RefreshTokensTable)
      .where(eq(RefreshTokensTable.id, tokenId))
      .returning();

    if (!refreshToken) {
      throw new ErrorHandler(
        "Refresh Token Was Not Fount",
        HTTP_STATUS.NOT_FOUND
      );
    }
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Failed To Delete Refresh Token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export const revokeRefreshToken = async (
  userId: string,
  ip: string,
  userAgent: string
) => {
  try {
    const refreshToken = await db
      .update(RefreshTokensTable)
      .set({ is_revoked: true })
      .where(
        and(
          eq(RefreshTokensTable.user_id, userId),
          eq(RefreshTokensTable.ip_address, ip),
          eq(RefreshTokensTable.user_agent, userAgent)
        )
      )
      .returning();

    if (!refreshToken) {
      throw new ErrorHandler(
        "Refresh Token Was Not Fount",
        HTTP_STATUS.NOT_FOUND
      );
    }
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Failed To Revoke Refresh Token",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
};
