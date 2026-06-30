// src/App.jsx

import { useState } from 'react';
import Header from './components/Header';
import MetalSection from './components/MetalSection';
import LoadingSpinner from './components/LoadingSpinner';
import { useMetalPrices } from './hooks/useMetalPrices';

export default function App() {
  const { goldPrices, silverPrices, loading, error, lastUpdated, refetch } = useMetalPrices();
  const [showGST, setShowGST] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Location + GST toggle ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            📍 <strong className="text-gray-800">Jaipur, Rajasthan</strong>
            <span className="text-gray-400 ml-2">— same as India national spot rate, since gold/silver pricing isn't city-specific</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showGST}
              onChange={(e) => setShowGST(e.target.checked)}
              className="accent-yellow-600 w-4 h-4"
            />
            Include 3% GST
          </label>
        </div>

        {/* ── Status bar ── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8 text-sm text-gray-500">
          {lastUpdated ? (
            <span>
              Last updated: <strong className="text-gray-700">{lastUpdated.toLocaleTimeString()}</strong>
              <span className="ml-2 text-xs text-gray-400">(auto-refreshes every 5 min)</span>
            </span>
          ) : (
            <span>Loading prices for the first time...</span>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Refreshing...' : '↻ Refresh Now'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <strong>⚠ Could not fetch prices:</strong> {error}
            <button onClick={refetch} className="underline ml-2">Try again</button>
          </div>
        )}

        {loading && !goldPrices && <LoadingSpinner />}

        {goldPrices && (
          <MetalSection title="Gold Prices" emoji="🥇" prices={goldPrices.map(p => ({ ...p, showGST }))} accentClass="text-yellow-700" />
        )}

        {silverPrices && (
          <MetalSection title="Silver Prices" emoji="🥈" prices={silverPrices.map(p => ({ ...p, showGST }))} accentClass="text-gray-600" />
        )}

        {goldPrices && (
          <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 text-sm text-gray-500 space-y-2">
            <p className="font-medium text-gray-700">How does this match Jaipur jewellers' rates?</p>
            <p>Gold and silver are priced the same nationwide off the international spot rate — there's no separate Jaipur exchange. A Jaipur jeweller's counter price is: <strong>spot rate + 3% GST + making charges</strong> (making charges vary by shop, typically 8–25% for gold).</p>
            <p>This app shows you the spot + GST part live. Add your local jeweller's making charge % on top to get the exact counter price.</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Prices powered by GoldAPI.io · For reference only, not financial advice
        </p>
      </main>
    </div>
  );
}