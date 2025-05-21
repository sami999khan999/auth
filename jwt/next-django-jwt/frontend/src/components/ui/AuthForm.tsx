"use client";

import React, { useMemo, useReducer, useState } from "react";
import Button from "../ui/Button";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AuthFieldsType, AuthFormTypes } from "@/types/auth";
import { authFormValidator } from "@/utils/validator";
import cn from "@/utils/cn";

const AuthForm = ({
  fields,
  submitHandler,
  title,
  subtitle,
  footerContent,
  isLoading,
}: AuthFormTypes) => {
  const initialFormData = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {} as Record<AuthFieldsType, string>);
  }, [fields]);

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({} as Record<AuthFieldsType, string>);

  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = authFormValidator(formData, fields);

    console.log(errors);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    submitHandler(formData);
  };

  const handelChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: AuthFieldsType
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <form
      onSubmit={(e) => formHandler(e)}
      className="flex flex-col items-center px-8 py-10 rounded-radius-sm md:w-[35rem] w-[90%] bg-gradient-to-b from-on-surface via-muted/10 to-on-surface border-2 border-muted/10"
    >
      <div className="w-full space-y-4">
        <div className="mb-6 space-y-1">
          <h3 className="text-xl text-strong font-semibold">{title}</h3>
          <p className="text-basec line-clamp-2">{subtitle}</p>
        </div>
        {fields.map((field) => (
          <div key={field} className="flex flex-col gap-1 w-full">
            <label
              htmlFor={field}
              className="capitalize text-basec font-medium"
            >
              {field}
            </label>
            <div className="relative">
              <input
                className={cn(
                  "bg-surface w-full px-2 py-1 focus:outline-2 focus:outline-muted rounded-[1px]",
                  errors[field] && "outline-1 outline-error"
                )}
                type={
                  field === "name"
                    ? "text"
                    : field === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : "text"
                }
                id={field}
                name={field}
                value={formData[field]}
                placeholder={field === "email" ? "example@gmail.com" : ""}
                onChange={(e) => handelChange(e, field)}
              />
              {field === "password" && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer px-1 py-1 hover:bg-on-surface duration-200 rounded-sm
                "
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              )}
            </div>
            <p className="text-xs text-error">{errors && errors[field]}</p>
          </div>
        ))}
      </div>
      <Button className="mt-6 w-full" isLoading={isLoading}>
        {title.split(" ")[0]}
      </Button>
      <div className="mt-2 text-basec">{footerContent}</div>
    </form>
  );
};

export default AuthForm;
