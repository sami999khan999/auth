import cn from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const buttonVarients = cva(
  "px-4 py-2 rounded font-medium transition-colors hover:bg-secondary duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-surface hover:bg-primary/80",
        destructive: "bg-secondary text-surface hover:bg-secondary/80",
        outline: "border text-basec",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVarients> {
  isLoading?: boolean;
}

const Button = ({
  variant,
  size,
  isLoading,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVarients({ variant, size }), className as string, {
        "cursor-not-allowed": isLoading,
      })}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
