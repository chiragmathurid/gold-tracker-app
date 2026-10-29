// src/hooks/useMetalPrices.js

import { useState, useEffect, useCallback } from 'react';
import { subscribeToRates } from '../services/liveRates';

// Gold RTGS 99.50 sell rate is treated as the 24 carat rate (per 10 g).
// Lower carats = (24 carat rate ÷ 24) × carat, e.g. 145779 ÷ 24 × 18 = 1,09,334.25
function buildGoldPrices(rate24) {
  const byCarat = (carat) => (rate24 / 24) * carat;
  return [
    { carat: '22K', label: '22 Carat Gold',   purity: '91.67%', price: byCarat(22), note: '= 24K rate ÷ 24 × 22' },
    { carat: '18K', label: '18 Carat Gold',   purity: '75%',    price: byCarat(18), note: '= 24K rate ÷ 24 × 18' },
    { carat: '14K', label: '14 Carat Gold',   purity: '58.33%', price: byCarat(14), note: '= 24K rate ÷ 24 × 14' },
    { carat: '9K',  label: '9 Carat Gold',    purity: '37.5%',  price: byCarat(9), note: '= 24K rate ÷ 24 × 9' },
    { carat: '24K', label: '24 Carat (Pure)', purity: '99.5%',  price: rate24, isPure: true },
  ];
}

// Silver .999 RTGS sell rate (per kg); 92.5 silver = 92.5% of it
function buildSilverPrices(rate999) {
  return [
    { carat: '92.5', label: '92.5 Silver',      purity: '92.5%', price: rate999 * 0.925, note: '= .999 rate × 92.5%' },
    { carat: '.999', label: '.999 Silver (Pure)', purity: '99.9%', price: rate999, isPure: true },
  ];
}

export function useMetalPrices() {
  const [goldPrices, setGoldPrices]   = useState(null);
  const [silverPrices, setSilverPrices] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [connection, setConnection]   = useState(0); // bump to reconnect

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToRates(
      ({ gold, silver }) => {
        setError(null);
        setGoldPrices(buildGoldPrices(gold));
        setSilverPrices(buildSilverPrices(silver));
        setLastUpdated(new Date());
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
    return unsubscribe; // disconnect on unmount / reconnect
  }, [connection]);

  const refetch = useCallback(() => setConnection((n) => n + 1), []);

  return { goldPrices, silverPrices, loading, error, lastUpdated, refetch };
}
