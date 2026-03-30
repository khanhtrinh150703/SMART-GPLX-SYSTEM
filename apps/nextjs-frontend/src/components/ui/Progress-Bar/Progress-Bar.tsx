interface ProgressBarProps {
  current: number;
  max: number;
  color?: "emerald" | "rose";
}

export const ProgressBar = ({ current, max, color = "emerald" }: ProgressBarProps) => {
  const width = (current / max) * 100;
  const colorClass = color === "emerald" ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
      <div
        className={`h-full transition-all duration-1000 ease-linear ${colorClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};