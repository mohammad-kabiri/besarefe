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
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <label className="block" htmlFor="output-unit">
        <span
          id="output-unit-title"
          className="mb-1 block text-lg font-bold text-slate-950"
        >
          واحد مقایسه
        </span>
        <select
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
      <p className="mt-2 text-sm leading-6 text-slate-600">
        واحد خروجی باید با نوع محصولات سازگار باشد؛ وزن و حجم بدون چگالی قابل
        تبدیل به هم نیستند.
      </p>
    </section>
  );
}
