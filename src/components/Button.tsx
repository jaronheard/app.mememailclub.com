import clsx from "clsx";
import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: "sm" | "base";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

function Button({
  href,
  onClick,
  children,
  className,
  size = "base",
  variant = "primary",
  disabled,
  type = "button",
}: ButtonProps) {
  if (href && onClick) {
    throw new Error("Button cannot have both href and onClick");
  }
  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          "inline-flex rounded-md border px-4 py-2 font-bold shadow-button",
          {
            "text-sm": size === "sm",
            "text-base": size === "base",
          },
          {
            "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-950":
              variant === "primary",
            "border-indigo-700 bg-white text-indigo-700 hover:bg-gray-100 active:bg-gray-200":
              variant === "secondary",
          },
          className
        )}
      >
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        className={clsx(
          "inline-flex rounded-md border px-4 py-2 font-bold shadow-button",
          {
            "text-sm": size === "sm",
            "text-base": size === "base",
          },
          {
            "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-950":
              variant === "primary",
            "border-indigo-700 bg-white text-indigo-700 hover:bg-gray-100 active:bg-gray-200":
              variant === "secondary",
            "border-transparent bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-300":
              variant === "danger",
          },
          className
        )}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  }
  throw new Error("Button must have either href or onClick");
}

export default Button;
