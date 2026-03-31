import style from "./input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  helperText,
  icon,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className={`${style.inputWrapper} ${error ? style.error : ""} ${className}`}>
      {label && <label className={style.label}>{label}</label>}
      <div className={style.inputContainer}>
        {icon && <span className={style.icon}>{icon}</span>}
        <input className={style.input} {...props} />
      </div>
      {error && <span className={style.errorText}>{error}</span>}
      {helperText && !error && <span className={style.helperText}>{helperText}</span>}
    </div>
  );
};
