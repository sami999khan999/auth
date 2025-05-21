import { UserJwtPayload } from "@/types/auth";
import { jwtVerify } from "jose";

export const verifyToken = async (token: string) => {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      token,
      encoder.encode(process.env.REFRESH_SECRET as string)
    );
    return payload as UserJwtPayload;
  } catch (error) {
    return null;
  }
};
