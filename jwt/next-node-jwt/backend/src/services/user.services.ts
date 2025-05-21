import bcrypt from "bcrypt";
import { eq, is } from "drizzle-orm";
import { HTTP_STATUS } from "../constants/error.constants";
import { db } from "../drizzle/db";
import { UsersTable } from "../drizzle/schema";
import { RegisteredUserType, UserRegisterType } from "../types/users.type";
import ErrorHandler from "../utils/errorHandler";

// services

export const register = async ({
  name,
  email,
  password,
}: UserRegisterType): Promise<RegisteredUserType> => {
  try {
    const existingUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.email, email),
    });

    if (existingUser) {
      throw new ErrorHandler("User Already Exists", HTTP_STATUS.CONFLICT);
    }
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Failed to check user existence. Please try again later.",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  let password_hash;

  try {
    password_hash = await bcrypt.hash(password, 10);
  } catch (err) {
    throw new ErrorHandler(
      "Failed To Hash Password",
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }

  try {
    const [user] = await db
      .insert(UsersTable)
      .values({ name, email, password_hash })
      .returning({
        id: UsersTable.id,
        email: UsersTable.email,
        name: UsersTable.name,
        role: UsersTable.user_role,
      });

    return user;
  } catch {
    throw new ErrorHandler(
      "Cound Not Create User",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const login = async (
  email: string,
  password: string
): Promise<RegisteredUserType> => {
  try {
    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.email, email),
    });

    if (!user) {
      throw new ErrorHandler("User Not Found", HTTP_STATUS.NOT_FOUND);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new ErrorHandler("Invalid Password", HTTP_STATUS.UNAUTHORIZED);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.user_role,
    };
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Failed To Login User",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export const getUser = async (userId: string): Promise<RegisteredUserType> => {
  try {
    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, userId),
    });

    if (!user) {
      throw new ErrorHandler(
        "User Does Not Exists",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.user_role,
    };
  } catch (err) {
    if (err instanceof ErrorHandler) {
      throw err;
    } else {
      throw new ErrorHandler(
        "Could Not Retrieve User From The DB",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
};
