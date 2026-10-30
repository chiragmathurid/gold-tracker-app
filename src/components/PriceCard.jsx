const formatINR = (value) => value.toLocaleString('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export default function PriceCard({ carat, label, price, purity, unit, note, change = null, isPure = false }) {
  const formatted = formatINR(price);

  // Green when up from the day's open, red when down, default colours when unchanged/unknown
  const isUp = change > 0;
  const isDown = change < 0;
  const boxClass = isUp
    ? 'bg-green-50 border-green-300 ring-1 ring-green-200'
    : isDown
      ? 'bg-red-50 border-red-300 ring-1 ring-red-200'
      : isPure
        ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-200'
        : 'bg-white border-gray-200';

  return (
    <div className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${boxClass}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPure ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {carat}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-1">{label}</p>

      <p className="text-2xl font-bold text-gray-900 tracking-tight">
        ₹{formatted}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {unit} · {purity} pure
      </p>

      {change !== null && (
        <p className={`text-xs font-medium mt-1 ${isUp ? 'text-green-700' : isDown ? 'text-red-700' : 'text-gray-500'}`}>
          {isUp ? '▲' : isDown ? '▼' : '•'} ₹{formatINR(Math.abs(change))} since today's open
        </p>
      )}

      {note && (
        <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
          {note}
        </p>
      )}
    </div>
  );
}
