import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="text-lg font-black text-slate-950 transition hover:text-emerald-700"
          href="/"
        >
          مقایسه قیمت واحد
        </Link>

        <nav aria-label="ناوبری اصلی" className="grid grid-cols-2 gap-2 sm:flex">
          <Link
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            href="/"
          >
            مقایسه جدید
          </Link>
          <Link
            className="min-h-11 rounded-xl bg-slate-950 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            href="/saved"
          >
            ذخیره‌شده‌ها
          </Link>
        </nav>
      </div>
    </header>
  );
}
