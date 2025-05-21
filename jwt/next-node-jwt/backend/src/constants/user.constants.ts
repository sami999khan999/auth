import { UserFieldValidatorTypes } from "../types/users.type";

export const userRegisterFields: UserFieldValidatorTypes[] = [
  { field: "name", required: true, type: "string", minLength: 3 },
  { field: "email", required: true, type: "email" },
  { field: "password", required: true, type: "string", minLength: 6 },
];
