export type AuthFieldsType = "email" | "password" | "name";

export type AuthFormTypes = {
  fields: AuthFieldsType[];
  submitHandler: (data: Record<AuthFieldsType, string>) => void;
  title: string;
  subtitle: string;
  footerContent: React.ReactNode;
  isLoading?: boolean;
};

export type UserJwtPayload = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | null;
  iat: number;
  exp: number;
};
