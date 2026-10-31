// src/hooks/useCity.js

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'selectedCity';
const DEFAULT_CITY = 'Jaipur';

function readSavedCity() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_CITY;
  } catch {
    return DEFAULT_CITY; // storage blocked (e.g. private window)
  }
}

// The city is a display label only; prices are the same for every city
export function useCity() {
  const [city, setCityState] = useState(readSavedCity);

  const setCity = useCallback((value) => {
    const next = value.trim() || DEFAULT_CITY;
    setCityState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore: the choice just won't be remembered
    }
  }, []);

  return { city, setCity };
}
