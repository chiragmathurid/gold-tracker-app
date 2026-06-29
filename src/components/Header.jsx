export default function Header() {
  return (
    <header className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400 py-8 px-4 shadow-md">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Gold & Silver Prices
        </h1>
        <p className="text-yellow-100 mt-2 text-sm">
          Live prices per gram · Indian Rupees (₹) · All Karats compared to 24K pure
        </p>
      </div>
    </header>
  );
}