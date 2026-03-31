import style from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = style.button;
  const variantClasses = {
    primary: style.primary,
    secondary: style.secondary,
    danger: style.danger,
    outline: style.outline,
  };
  const sizeClasses = {
    small: style.small,
    medium: style.medium,
    large: style.large,
  };
  const fullWidthClass = fullWidth ? style.fullWidth : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={style.loader}>Загрузка...</span>
      ) : (
        children
      )}
    </button>
  );
};
