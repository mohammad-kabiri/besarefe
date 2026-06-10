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
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
      <button
        className="min-h-12 w-full rounded-xl bg-slate-950 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        disabled={!hasProducts}
        onClick={() => setModalOpen(true)}
        type="button"
      >
        ⭐ ذخیره مقایسه
      </button>

      {!hasProducts ? (
        <p className="mt-2 text-center text-sm text-slate-500">
          برای ذخیره، ابتدا حداقل یک محصول وارد کنید.
        </p>
      ) : null}

      <SaveComparisonModal
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        outputUnit={outputUnit}
        products={products}
      />
    </section>
  );
}
