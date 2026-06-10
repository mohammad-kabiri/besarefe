"use client";

import type { OutputUnit } from "@/types/product";

import { OUTPUT_UNIT_OPTIONS } from "@/lib/constants";
import { useComparisonStore } from "@/store/comparisonStore";

export default function OutputUnitSelector() {
  const outputUnit = useComparisonStore((state) => state.outputUnit);
  const setOutputUnit = useComparisonStore((state) => state.setOutputUnit);

  return (
    <section
      aria-labelledby="output-unit-title"
      className="rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-sm font-black text-[var(--color-primary-strong)]">
          ۲
        </span>
        <div>
          <h2
            id="output-unit-title"
            className="text-xl font-black text-[var(--color-text)]"
          >
            واحد مقایسه
          </h2>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            قیمت هر محصول بر اساس این واحد محاسبه می‌شود.
          </p>
        </div>
      </div>

      <label className="block" htmlFor="output-unit">
        <span className="mb-1 block text-sm font-bold text-slate-800">
          محاسبه قیمت بر اساس
        </span>
        <select
          className="h-13 min-h-13 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base font-bold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-teal-100"
          id="output-unit"
          onChange={(event) => setOutputUnit(event.target.value as OutputUnit)}
          value={outputUnit}
        >
          {OUTPUT_UNIT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 rounded-3xl border border-amber-200 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-7 text-amber-800">
        محصولات وزنی را با واحد وزنی و محصولات حجمی را با واحد حجمی مقایسه
        کنید.
      </div>
    </section>
  );
}
