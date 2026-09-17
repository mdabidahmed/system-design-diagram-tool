import { ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "@/utils/cx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconStart,
      iconEnd,
      fullWidth,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cx(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className,
        )}
        {...rest}
      >
        {iconStart && <span className={styles.icon}>{iconStart}</span>}
        <span>{children}</span>
        {iconEnd && <span className={styles.icon}>{iconEnd}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
