import style from "./loader.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
  variant?: "spinner" | "pulse" | "skeleton";
}

export const Loader = ({ size = "medium", text, variant = "spinner" }: LoaderProps) => {
  const sizeClasses = {
    small: style.small,
    medium: style.medium,
    large: style.large,
  };

  if (variant === "skeleton") {
    return <div className={`${style.skeleton} ${sizeClasses[size]}`} />;
  }

  return (
    <div className={style.loaderWrapper}>
      <div className={`${style.loader} ${sizeClasses[size]} ${style[variant]}`}>
        {variant === "spinner" && (
          <svg className={style.spinner} viewBox="0 0 50 50">
            <circle className={style.circle} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
          </svg>
        )}
        {variant === "pulse" && <div className={style.pulse} />}
      </div>
      {text && <span className={style.text}>{text}</span>}
    </div>
  );
};
