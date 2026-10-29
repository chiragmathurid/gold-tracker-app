// src/services/liveRates.js
// Live rates from http://www.lawatjewellers.com/liverate.html (streamed over socket.io)

import { io } from 'socket.io-client';

const SOCKET_URL = 'https://starlinesupport.co.in:10001';
const ROOM = 'lawatjewellers';

// SymbolId is stable; the name is a fallback in case the id ever changes
const GOLD_SYMBOL   = { id: '421', name: 'GOLD RTGS 99.50' };
const SILVER_SYMBOL = { id: '423', name: 'SILVER .999 RTGS' };

const normalize = (s) => s.replace(/\s+/g, ' ').trim().toUpperCase();

function findSellRate(rates, { id, name }) {
  const row = rates.find((r) => r.SymbolId === id) ?? rates.find((r) => normalize(r.Symbol) === name);
  const ask = Number(row?.Ask);
  return Number.isFinite(ask) && ask > 0 ? ask : null;
}

/**
 * Subscribes to live rates. Calls onRates({ gold, silver }) with the SELL rates
 * (gold per 10 g, silver per kg) every time the site pushes an update.
 * Returns an unsubscribe function.
 */
export function subscribeToRates(onRates, onError) {
  // websocket-only: the polling transport is blocked by CORS outside the site's own origin
  const socket = io(SOCKET_URL, { transports: ['websocket'] });

  socket.on('connect', () => socket.emit('room', ROOM));
  socket.on('connect_error', () => onError('Unable to connect to the live rate server'));

  socket.on('message', (data) => {
    const rates = data?.Rate;
    if (!Array.isArray(rates)) return;

    const gold = findSellRate(rates, GOLD_SYMBOL);
    const silver = findSellRate(rates, SILVER_SYMBOL);
    if (gold === null || silver === null) {
      onError('Live rate for GOLD RTGS 99.50 or Silver .999 RTGS is currently not available');
      return;
    }
    onRates({ gold, silver });
  });

  return () => socket.disconnect();
}
