// src/hooks/useMetalPrices.js

import { useState, useEffect, useCallback } from 'react';
import { fetchMetalPrice } from '../services/goldApi';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const GST_RATE = 0.03; // 3% GST on gold/silver in India

// ─── Karat calculation logic ───────────────────────────────────────────────
// Gold doesn't have a separate "Jaipur" spot price — Jaipur jewellers quote
// the same national India rate (from IBJA/MCX) + 3% GST + their own making
// charges. We replicate that here so the numbers match what you'd see at
// a Jaipur jeweller's counter.

function withGST(price) {
  return price * (1 + GST_RATE);
}

function buildGoldPrices(data) {
  const p24 = data.price_gram_24k;
  const raw = [
    { Karat: '22K', label: '22 Karat Gold',   purity: '91.67%', spot: data.price_gram_22k ?? (22 / 24) * p24 },
    { Karat: '18K', label: '18 Karat Gold',   purity: '75%',    spot: data.price_gram_18k ?? (18 / 24) * p24 },
    { Karat: '9K',  label: '9 Karat Gold',    purity: '37.5%',  spot: (9  / 24) * p24 },
    { Karat: '1K',  label: '1 Karat Gold',    purity: '4.17%',  spot: (1  / 24) * p24 },
    { Karat: '24K', label: '24 Karat (Pure)', purity: '100%',   spot: p24, isPure: true },
  ];
  return raw.map(item => ({ ...item, price: item.spot, priceWithGST: withGST(item.spot) }));
}

function buildSilverPrices(data) {
  const p24 = data.price_gram_24k;
  const raw = [
    { Karat: '22K', label: '22 Karat Silver', purity: '91.67%', spot: (22 / 24) * p24 },
    { Karat: '24K', label: '24 Karat (Pure)',  purity: '100%',   spot: p24, isPure: true },
  ];
  return raw.map(item => ({ ...item, price: item.spot, priceWithGST: withGST(item.spot) }));
}

export function useMetalPrices() {
  const [goldPrices, setGoldPrices]     = useState(null);
  const [silverPrices, setSilverPrices] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastUpdated, setLastUpdated]   = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [goldRaw, silverRaw] = await Promise.all([
        fetchMetalPrice('XAU', 'INR'),
        fetchMetalPrice('XAG', 'INR'),
      ]);
      setGoldPrices(buildGoldPrices(goldRaw));
      setSilverPrices(buildSilverPrices(silverRaw));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const timer = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchAll]);

  return { goldPrices, silverPrices, loading, error, lastUpdated, refetch: fetchAll };
}