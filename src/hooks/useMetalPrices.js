// src/hooks/useMetalPrices.js

import { useState, useEffect, useCallback } from 'react';
import { fetchMetalPrice } from '../services/goldApi';

const REFRESH_INTERVAL = 5 * 60 * 1000;
const MARKUP_PERCENT = 16.5;

// Helper: apply 16.5% markup to a raw price
function withMarkup(price) {
  return price * (1 + MARKUP_PERCENT / 100);
}

function buildGoldPrices(data) {
  const p24 = data.price_gram_24k;
  return [
    { Karat: '22K', label: '22 Karat Gold',   purity: '91.67%', price: withMarkup(data.price_gram_22k ?? (22 / 24) * p24) },
    { Karat: '18K', label: '18 Karat Gold',   purity: '75%',    price: withMarkup(data.price_gram_18k ?? (18 / 24) * p24) },
    { Karat: '9K',  label: '9 Karat Gold',    purity: '37.5%',  price: withMarkup((9  / 24) * p24) },
    { Karat: '1K',  label: '1 Karat Gold',    purity: '4.17%',  price: withMarkup((1  / 24) * p24) },
    { Karat: '24K', label: '24 Karat (Pure)',  purity: '100%',   price: withMarkup(p24), isPure: true },
  ];
}

function buildSilverPrices(data) {
  const p24 = data.price_gram_24k;
  return [
    { Karat: '22K', label: '22 Karat Silver', purity: '91.67%', price: withMarkup((22 / 24) * p24) },
    { Karat: '24K', label: '24 Karat (Pure)', purity: '100%',   price: withMarkup(p24), isPure: true },
  ];
}

// ... rest of the file stays exactly the same

export function useMetalPrices() {
  const [goldPrices, setGoldPrices]   = useState(null);
  const [silverPrices, setSilverPrices] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);

      // Fetch gold (XAU) and silver (XAG) in parallel — faster than sequential
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
    fetchAll(); // fetch immediately on mount

    const timer = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(timer); // cleanup on unmount
  }, [fetchAll]);

  return { goldPrices, silverPrices, loading, error, lastUpdated, refetch: fetchAll };
}