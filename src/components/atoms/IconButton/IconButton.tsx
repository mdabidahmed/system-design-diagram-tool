import { ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "@/utils/cx";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, active, size = "md", className, children, ...rest }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cx(styles.btn, styles[size], active && styles.active, className)}
      {...rest}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = "IconButton";
