export default function ProgressBar({ funded, total }: { funded: number; total: number }) {
  const progressPercentage = Math.min((funded / total) * 100, 100);
  return (
    <div className="mt-4">
      <div className="flex justify-between text-green-700">
        <div className="text-sm text-gray-600 mb-1">
          Loan Progress: ${funded.toLocaleString()} / ${total.toLocaleString()}
        </div>
        <p className="text-sm">{`${progressPercentage.toFixed(2)}%`}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
}
