// src/services/liveRates.js
// Live rates from http://www.lawatjewellers.com/liverate.html (streamed over socket.io)

import { io } from 'socket.io-client';

const SOCKET_URL = 'https://starlinesupport.co.in:10001';
const ROOM = 'lawatjewellers';

// SymbolId is stable; the name is a fallback in case the id ever changes
const GOLD_SYMBOL   = { id: '421', name: 'GOLD RTGS 99.50' };
const SILVER_SYMBOL = { id: '423', name: 'SILVER .999 RTGS' };

// MCX contracts the sell rates are based on (sell rate = MCX rate + Lawat's premium)
const MCX_GOLD   = 'gold';
const MCX_SILVER = 'silver';

const normalize = (s) => s.replace(/\s+/g, ' ').trim().toUpperCase();

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

function findRow(rates, { id, name }) {
  return rates.find((r) => r.SymbolId === id) ?? rates.find((r) => normalize(r.Symbol) === name);
}

function findMcxOpen(rates, symbol) {
  return toNumber(rates.find((r) => r.symbol?.toLowerCase() === symbol)?.Open);
}

// Change since the day's open. The premium is fixed, so the MCX change equals the sell-rate change.
function changeSinceOpen(row, open) {
  const mcx = toNumber(row?.McxAsk);
  return mcx !== null && open !== null ? mcx - open : null;
}

/**
 * Subscribes to live rates. Calls onRates({ gold, silver, goldChange, silverChange })
 * with the SELL rates (gold per 10 g, silver per kg) and their change since the day's
 * open (null until the opening price is known) every time the site pushes an update.
 * Returns an unsubscribe function.
 */
export function subscribeToRates(onRates, onError) {
  // websocket-only: the polling transport is blocked by CORS outside the site's own origin
  const socket = io(SOCKET_URL, { transports: ['websocket'] });

  socket.on('connect', () => socket.emit('room', ROOM));
  socket.on('connect_error', () => onError('Unable to connect to the live rate server'));

  // MCX rates (with the day's opening price) arrive on a separate event
  let goldOpen = null;
  let silverOpen = null;
  socket.on('Liverate', (rates) => {
    if (!Array.isArray(rates)) return;
    goldOpen = findMcxOpen(rates, MCX_GOLD) ?? goldOpen;
    silverOpen = findMcxOpen(rates, MCX_SILVER) ?? silverOpen;
  });

  socket.on('message', (data) => {
    const rates = data?.Rate;
    if (!Array.isArray(rates)) return;

    const goldRow = findRow(rates, GOLD_SYMBOL);
    const silverRow = findRow(rates, SILVER_SYMBOL);
    const gold = toNumber(goldRow?.Ask);
    const silver = toNumber(silverRow?.Ask);
    if (gold === null || silver === null) {
      onError('Live rate for GOLD RTGS 99.50 or Silver .999 RTGS is currently not available');
      return;
    }
    onRates({
      gold,
      silver,
      goldChange: changeSinceOpen(goldRow, goldOpen),
      silverChange: changeSinceOpen(silverRow, silverOpen),
    });
  });

  return () => socket.disconnect();
}
