"use client";

import { useState } from "react";

import SaveComparisonModal from "@/components/SaveComparisonModal";
import { useComparisonStore } from "@/store/comparisonStore";

export default function SaveCurrentComparisonButton() {
  const products = useComparisonStore((state) => state.products);
  const outputUnit = useComparisonStore((state) => state.outputUnit);
  const [modalOpen, setModalOpen] = useState(false);
  const hasProducts = products.length > 0;

  return (
    <section className="rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-5">
      <button
        className="min-h-13 w-full rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        disabled={!hasProducts}
        onClick={() => setModalOpen(true)}
        type="button"
      >
        ذخیره این مقایسه
      </button>

      {!hasProducts ? (
        <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-center text-sm text-[var(--color-muted)]">
          برای ذخیره، ابتدا یک محصول اضافه کنید.
        </p>
      ) : (
        <p className="mt-3 text-center text-sm text-[var(--color-muted)]">
          این مقایسه فقط روی همین دستگاه ذخیره می‌شود.
        </p>
      )}

      <SaveComparisonModal
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        outputUnit={outputUnit}
        products={products}
      />
    </section>
  );
}
