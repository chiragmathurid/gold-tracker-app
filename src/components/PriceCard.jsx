// src/components/PriceCard.jsx

export default function PriceCard({ Karat, label, price, priceWithGST, purity, isPure = false, showGST }) {
  const fmt = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <div className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${
      isPure ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-200' : 'bg-white border-gray-200'
    }`}>
      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${
        isPure ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {Karat}
      </span>

      <p className="text-sm text-gray-500 mb-1">{label}</p>

      <p className="text-2xl font-bold text-gray-900 tracking-tight">
        ₹{fmt(showGST ? priceWithGST : price)}
      </p>

      {showGST && (
        <p className="text-xs text-gray-400 mt-0.5">
          (₹{fmt(price)} spot + 3% GST)
        </p>
      )}

      <p className="text-xs text-gray-400 mt-1">per gram · {purity} pure</p>

      {!isPure && (
        <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
          = {purity} × 24K price
        </p>
      )}
    </div>
  );
}