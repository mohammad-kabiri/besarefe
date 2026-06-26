"use client";

import type { OutputUnit } from "@/types/product";

import CustomSelect from "@/components/ui/CustomSelect";
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

      <div>
        <CustomSelect<OutputUnit>
          id="output-unit"
          label="واحد محاسبه قیمت"
          onChange={setOutputUnit}
          options={OUTPUT_UNIT_OPTIONS}
          value={outputUnit}
        />
      </div>

      <div className="mt-4 rounded-3xl border border-amber-200 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-7 text-amber-800">
        محصولات وزنی را با واحد وزنی و محصولات حجمی را با واحد حجمی مقایسه
        کنید.
      </div>
    </section>
  );
}
