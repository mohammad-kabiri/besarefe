import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="text-lg font-black text-slate-950"
          href="/"
        >
          مقایسه قیمت واحد
        </Link>

        <nav aria-label="ناوبری اصلی" className="flex gap-2">
          <Link
            className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
            href="/"
          >
            مقایسه جدید
          </Link>
          <Link
            className="min-h-11 flex-1 rounded-xl bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-none"
            href="/saved"
          >
            ذخیره‌شده‌ها
          </Link>
        </nav>
      </div>
    </header>
  );
}
