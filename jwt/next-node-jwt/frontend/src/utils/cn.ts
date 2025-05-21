import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...fields: ClassValue[]) => {
  return twMerge(clsx(fields));
};

export default cn;
