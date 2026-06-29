// src/services/goldApi.js

const API_KEY = import.meta.env.VITE_GOLD_API_KEY;
const BASE_URL = 'https://www.goldapi.io/api';

/**
 * metal = 'XAU' for gold, 'XAG' for silver
 * currency = 'INR' for Indian Rupees (or 'USD', 'EUR', etc.)
 */
export async function fetchMetalPrice(metal, currency = 'INR') {
  const response = await fetch(`${BASE_URL}/${metal}/${currency}`, {
    headers: {
      'x-access-token': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: Failed to fetch ${metal} price`);
  }

  return response.json();
}