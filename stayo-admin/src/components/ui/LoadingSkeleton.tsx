type LoadingSkeletonProps = {
  lines?: number;
};

export default function LoadingSkeleton({
  lines = 5,
}: LoadingSkeletonProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-4 rounded-xl bg-slate-200"
            style={{ width: `${90 - index * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}