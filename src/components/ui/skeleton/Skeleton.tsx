import style from "./skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const Skeleton = ({ width, height, borderRadius, className }: SkeletonProps) => {
  return (
    <div
      className={`${style.skeleton} ${className || ""}`}
      style={{
        width: width || "100%",
        height: height || "20px",
        borderRadius: borderRadius || "4px",
      }}
    />
  );
};
