export default function Spinner(props: { width: string; height: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${props.width} ${props.height} animate-spin inline-block border-[3px] border-current border-t-transparent text-gray-700 rounded-full`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
