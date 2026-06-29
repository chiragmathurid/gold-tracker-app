import Header from './components/Header';
import MetalSection from './components/MetalSection';
import LoadingSpinner from './components/LoadingSpinner';
import { useMetalPrices } from './hooks/useMetalPrices';

export default function App() {
  const { goldPrices, silverPrices, loading, error, lastUpdated, refetch } = useMetalPrices();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">

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

        {/* ── Error banner ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <strong>⚠ Could not fetch prices:</strong> {error}
            <button onClick={refetch} className="underline ml-2">Try again</button>
          </div>
        )}

        {/* ── Loading state ── */}
        {loading && !goldPrices && <LoadingSpinner />}

        {/* ── Gold prices ── */}
        {goldPrices && (
          <MetalSection
            title="Gold Prices"
            emoji="🥇"
            prices={goldPrices}
            accentClass="text-yellow-700"
          />
        )}

        {/* ── Silver prices ── */}
        {silverPrices && (
          <MetalSection
            title="Silver Prices"
            emoji="🥈"
            prices={silverPrices}
            accentClass="text-gray-600"
          />
        )}

        {/* ── Formula explanation ── */}
        {goldPrices && (
          <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">How are these prices calculated?</p>
            <p>All Karat prices are derived from the live 24K (pure) price per gram using the formula:</p>
            <code className="block mt-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700">
              Price (N Karat) = (N ÷ 24) × Price (24 Karat)
            </code>
            <p className="mt-2">
              Example: 22K gold = (22 ÷ 24) × 24K price = 91.67% of pure gold price.
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Prices powered by GoldAPI.io · For reference only, not financial advice
        </p>
      </main>
    </div>
  );
}