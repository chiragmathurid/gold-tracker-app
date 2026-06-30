// src/components/MetalSection.jsx

import PriceCard from './PriceCard';

export default function MetalSection({ title, emoji, prices, accentClass }) {
  return (
    <section className="mb-10">
      <h2 className={`text-xl font-bold mb-5 flex items-center gap-2 ${accentClass}`}>
        <span>{emoji}</span>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {prices.map((item) => (
          <PriceCard key={item.Karat} {...item} />
        ))}
      </div>
    </section>
  );
}