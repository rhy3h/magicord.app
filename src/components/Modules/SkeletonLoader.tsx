export default function SkeletonLoader({
  width = "w-full",
  height = "h-full",
  bg = "bg-gray-700",
}) {
  return (
    <div
      className={`${width} ${height} bg-gray-200 rounded-md dark:${bg}`}
    ></div>
  );
}
