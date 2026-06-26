import Image from "next/image";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] shadow-sm">
            <Image
              src="/icons/site-mark-transparent.svg"
              alt=""
              width={30}
              height={30}
              aria-hidden="true"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-black text-[var(--color-text)]">
              بصرفه
            </span>
            <span className="block text-xs font-medium text-[var(--color-muted)]">
              انتخاب اقتصادی‌تر، با حساب دقیق‌تر
            </span>
          </span>
        </Link>

        <nav aria-label="ناوبری اصلی" className="grid grid-cols-2 gap-2 sm:flex">
          <Link
            className="min-h-11 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2 text-center text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-200"
            href="/"
          >
            مقایسه جدید
          </Link>
          <Link
            className="min-h-11 rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-2 focus:ring-teal-200"
            href="/saved"
          >
            ذخیره‌شده‌ها
          </Link>
        </nav>
      </div>
    </header>
  );
}
