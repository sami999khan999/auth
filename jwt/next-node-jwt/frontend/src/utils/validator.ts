import { AuthFieldsType } from "@/types/auth";

export const authFormValidator = (
  formData: Record<AuthFieldsType, string>,
  fields: AuthFieldsType[]
) => {
  const newErrors = {} as Record<AuthFieldsType, string>;

  if (fields.includes("email")) {
    if (formData.email === "") {
      newErrors.email = "Email is Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
  }

  if (fields.includes("password")) {
    if (formData.password === "") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  }

  if (fields.includes("name")) {
    if (formData.name === "") {
      newErrors.name = "Username is required";
    }
  }

  return newErrors;
};
