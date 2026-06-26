"use client";

import { useEffect, useMemo } from "react";

import type { OutputUnit } from "@/types/product";

import CustomSelect from "@/components/ui/CustomSelect";
import {
  getOutputUnitOptionsForFamily,
  OUTPUT_UNIT_OPTIONS,
} from "@/lib/constants";
import { getOutputUnitFamily } from "@/lib/priceCalculator";
import { getProductFamilySummary } from "@/lib/validation";
import { useComparisonStore } from "@/store/comparisonStore";

export default function OutputUnitSelector() {
  const products = useComparisonStore((state) => state.products);
  const outputUnit = useComparisonStore((state) => state.outputUnit);
  const setOutputUnit = useComparisonStore((state) => state.setOutputUnit);
  const familySummary = useMemo(
    () => getProductFamilySummary(products),
    [products]
  );
  const outputOptions = useMemo(() => {
    if (familySummary.family === "mass" || familySummary.family === "volume") {
      return getOutputUnitOptionsForFamily(familySummary.family);
    }

    return OUTPUT_UNIT_OPTIONS;
  }, [familySummary.family]);
  const helperText =
    familySummary.family === "mass"
      ? "برای محصولات وزنی، قیمت بر اساس گرم، ۱۰۰ گرم یا کیلوگرم محاسبه می‌شود."
      : familySummary.family === "volume"
        ? "برای محصولات حجمی، قیمت بر اساس میلی‌لیتر، ۱۰۰ میلی‌لیتر یا لیتر محاسبه می‌شود."
        : familySummary.family === "mixed"
          ? "محصولات وزنی و حجمی را نمی‌توان در یک مقایسه واحد مقایسه کرد."
          : "بعد از افزودن محصول، گزینه‌های مناسب نمایش داده می‌شود.";

  useEffect(() => {
    if (
      familySummary.family === "mass" &&
      getOutputUnitFamily(outputUnit) !== "mass"
    ) {
      setOutputUnit("per_kg");
    }

    if (
      familySummary.family === "volume" &&
      getOutputUnitFamily(outputUnit) !== "volume"
    ) {
      setOutputUnit("per_l");
    }
  }, [familySummary.family, outputUnit, setOutputUnit]);

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
            واحد محاسبه بر اساس نوع محصول انتخاب می‌شود.
          </p>
        </div>
      </div>

      <CustomSelect<OutputUnit>
        helperText={helperText}
        id="output-unit"
        label="واحد محاسبه قیمت"
        onChange={setOutputUnit}
        options={outputOptions}
        value={outputUnit}
      />

      {familySummary.family === "mixed" ? (
        <div
          className="mt-4 rounded-3xl border border-amber-200 bg-[var(--color-warning-soft)] px-4 py-3 text-sm font-bold leading-7 text-amber-800"
          role="alert"
        >
          محصولات وزنی و حجمی را نمی‌توان در یک مقایسه واحد مقایسه کرد. لطفاً
          فقط یک نوع واحد را در این مقایسه نگه دارید.
        </div>
      ) : null}
    </section>
  );
}
