"use client";

import { useState } from "react";

import type { SaveMode } from "@/types/comparison";
import type { OutputUnit, ProductInput } from "@/types/product";

import { OUTPUT_UNIT_LABELS } from "@/lib/constants";
import { formatNumber } from "@/lib/numberUtils";
import { saveComparison } from "@/repositories/savedComparisonsRepository";

type SaveComparisonModalProps = {
  open: boolean;
  products: ProductInput[];
  outputUnit: OutputUnit;
  onClose: () => void;
  onSaved?: () => void;
};

export default function SaveComparisonModal({
  open,
  products,
  outputUnit,
  onClose,
  onSaved,
}: SaveComparisonModalProps) {
  const [title, setTitle] = useState("");
  const [savingMode, setSavingMode] = useState<SaveMode | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!open) {
    return null;
  }

  const isSaving = savingMode !== null;
  const hasProducts = products.length > 0;

  async function handleSave(saveMode: SaveMode) {
    if (!hasProducts) {
      return;
    }

    setSavingMode(saveMode);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await saveComparison({
        title,
        products,
        outputUnit,
        saveMode,
      });
      setSuccessMessage("مقایسه با موفقیت ذخیره شد.");
      onSaved?.();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "ذخیره مقایسه ناموفق بود."
      );
    } finally {
      setSavingMode(null);
    }
  }

  return (
    <div
      aria-labelledby="save-comparison-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-3 sm:items-center sm:justify-center sm:p-4"
      role="dialog"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:max-w-md sm:p-5">
        <div className="space-y-2">
          <h2
            className="text-xl font-black text-slate-950"
            id="save-comparison-title"
          >
            ذخیره مقایسه
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            می‌خواهید این مقایسه را چگونه ذخیره کنید؟
          </p>
        </div>

        <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p>
            تعداد محصولات:{" "}
            <span className="font-bold">{formatNumber(products.length)}</span>
          </p>
          <p>
            واحد خروجی:{" "}
            <span className="font-bold">{OUTPUT_UNIT_LABELS[outputUnit]}</span>
          </p>
        </div>

        <label className="mt-4 block" htmlFor="save-title">
          <span className="mb-1 block text-sm font-medium text-slate-800">
            عنوان ذخیره
          </span>
          <input
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            disabled={isSaving}
            id="save-title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="مثلاً خرید روغن یا مقایسه رب گوجه"
            type="text"
            value={title}
          />
        </label>

        {errorMessage ? (
          <p
            className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        <div className="mt-5 space-y-2">
          <button
            className="min-h-12 w-full rounded-xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSaving || !hasProducts}
            onClick={() => handleSave("all")}
            type="button"
          >
            {savingMode === "all" ? "در حال ذخیره..." : "ذخیره همه محصولات"}
          </button>

          <button
            className="min-h-12 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            disabled={isSaving || !hasProducts}
            onClick={() => handleSave("best-only")}
            type="button"
          >
            {savingMode === "best-only"
              ? "در حال ذخیره..."
              : "فقط ذخیره به‌صرفه‌ترین محصول"}
          </button>

          <button
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
