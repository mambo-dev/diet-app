import { VariantProps, cva } from "class-variance-authority";
import React, { HTMLAttributes, forwardRef } from "react";
//@ts-expect-error
import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

export const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
      ghost: "",
    },
    size: {
      default: "h-10 py-2 px-4",
      sm: "h-9 py-2 px-4 rounded-md",
      lg: "h-11 py-2 px-4 rounded-md",
      xl: "h-11 py-2 px-8 rounded-md",
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
});

interface Props
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ isLoading, className, children, variant, size, ...props }: Props, ref) => {
    return (
      <button
        {...props}
        disabled={isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
