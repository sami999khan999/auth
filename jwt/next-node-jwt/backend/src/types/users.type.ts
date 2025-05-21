export type UserRegisterType = {
  name: string;
  email: string;
  password: string;
};

export type UserFieldValidatorTypes = {
  field: keyof UserRegisterType;
  type?: "string" | "email" | "number";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
};

export type RegisteredUserType = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | null;
};

export type LoginUserType = {
  email: string;
  password: string;
};

export type UserJwtPayload = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | null;
  iat: number;
  exp: number;
};
