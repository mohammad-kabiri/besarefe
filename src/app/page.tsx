import Image from "next/image";

import ComparisonResult from "@/components/ComparisonResult";
import OutputUnitSelector from "@/components/OutputUnitSelector";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import SaveCurrentComparisonButton from "@/components/SaveCurrentComparisonButton";

const steps = [
  "محصول را اضافه کن",
  "واحد مقایسه را انتخاب کن",
  "بصرفه‌ترین را ببین",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:py-8">
      <section className="overflow-hidden rounded-4xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden size-14 shrink-0 items-center justify-center rounded-3xl bg(--color-primary-soft) sm:flex">
            <Image
              src="/icons/site-mark-transparent.svg"
              alt=""
              width={38}
              height={38}
              aria-hidden="true"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-(--color-primary)">
              محصولات را وارد کن؛ بصرفه‌ترین گزینه را ببین.
            </p>
            <h1 className="mt-1 text-3xl font-black text-foreground sm:text-4xl">
              بصرفه
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-8 text-(--color-muted)">
              محصولات را وارد کنید تا ببینید کدام گزینه واقعاً اقتصادی‌تر است.
              قیمت‌ها بر اساس وزن یا حجم یکسان محاسبه می‌شوند.
            </p>
          </div>
        </div>

        <ol className="mt-5 grid gap-2 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              className="flex items-center gap-2 rounded-2xl bg-(--color-surface-soft) px-3 py-3 text-sm font-bold text-(--color-primary-strong)"
              key={step}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-xs shadow-sm">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <ProductForm />
      <OutputUnitSelector />
      <ProductList />
      <ComparisonResult />
      <SaveCurrentComparisonButton />
    </main>
  );
}
