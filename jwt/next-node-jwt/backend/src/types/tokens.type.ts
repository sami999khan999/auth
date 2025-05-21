export type RefreshTokensType = {
  userId: string;
  token: string;
  userAgent: string;
  ipAddress: string;
};

export type RefreshTokenPayloadType = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | null;
};
