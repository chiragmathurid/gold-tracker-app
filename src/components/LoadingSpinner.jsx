export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-yellow-300 border-t-yellow-600 animate-spin" />
      <p className="text-gray-500 text-sm">Fetching live prices...</p>
    </div>
  );
}