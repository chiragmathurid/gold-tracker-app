import { useState } from 'react';

// Suggestions only: any city can be typed in
const SUGGESTED_CITIES = [
  'Jaipur', 'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad',
  'Ahmedabad', 'Pune', 'Surat', 'Lucknow', 'Kanpur', 'Indore', 'Bhopal',
  'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Chandigarh', 'Patna', 'Nagpur',
];

export default function CitySelector({ city, onChange }) {
  const [draft, setDraft]       = useState(city);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState(-1); // highlighted suggestion (keyboard)
  const [filtering, setFiltering] = useState(false); // false = show all, true = filter by typed text

  const query = draft.trim().toLowerCase();
  const suggestions = filtering && query
    ? SUGGESTED_CITIES.filter((name) => name.toLowerCase().includes(query))
    : SUGGESTED_CITIES;

  const select = (value) => {
    const next = value.trim() || city;
    onChange(next);
    setDraft(next);
    setOpen(false);
    setActive(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      if (suggestions.length === 0) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(open && active >= 0 ? suggestions[active] : draft);
    } else if (e.key === 'Escape') {
      setDraft(city);
      setOpen(false);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <label htmlFor="city-input">📍 City:</label>
      <div className="relative">
        <input
          id="city-input"
          role="combobox"
          aria-expanded={open}
          aria-controls="city-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setFiltering(true);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={(e) => {
            e.target.select();
            setFiltering(false);
            setOpen(true);
          }}
          // the field keeps focus after a pick, so a click must also reopen the list
          onClick={() => {
            setFiltering(false);
            setOpen(true);
          }}
          onBlur={() => select(draft)}
          onKeyDown={handleKeyDown}
          placeholder="Type or pick a city"
          className="w-48 bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          ▾
        </span>

        {open && suggestions.length > 0 && (
          <ul
            id="city-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1 z-20 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg py-1"
          >
            {suggestions.map((name, i) => {
              const isSelected = name === city;
              return (
                <li
                  key={name}
                  role="option"
                  aria-selected={isSelected}
                  // mousedown (not click) so the input's blur doesn't close the list first
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(name);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center justify-between px-3 py-1.5 cursor-pointer text-sm ${
                    i === active ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700'
                  }`}
                >
                  {name}
                  {isSelected && <span className="text-yellow-600 text-xs">✓</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
