"use client";

import { useState } from "react";

import type { SaveMode } from "@/types/comparison";
import type { OutputUnit, ProductInput } from "@/types/product";

import { getOutputUnitLabel } from "@/lib/constants";
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
      className="fixed inset-0 z-50 flex items-end bg-slate-950/55 p-3 sm:items-center sm:justify-center sm:p-4"
      role="dialog"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:max-w-md sm:p-6">
        <div className="space-y-2">
          <h2
            className="text-2xl font-black text-[var(--color-text)]"
            id="save-comparison-title"
          >
            ذخیره مقایسه
          </h2>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            می‌توانید همه محصولات را ذخیره کنید یا فقط گزینه بصرفه‌تر را نگه
            دارید.
          </p>
        </div>

        <div className="mt-4 grid gap-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <p>
            تعداد محصولات:{" "}
            <span className="font-black">{formatNumber(products.length)}</span>
          </p>
          <p>
            واحد مقایسه:{" "}
            <span className="font-black">{getOutputUnitLabel(outputUnit)}</span>
          </p>
        </div>

        <label className="mt-4 block" htmlFor="save-title">
          <span className="mb-1 block text-sm font-bold text-slate-800">
            عنوان ذخیره
          </span>
          <input
            className="h-13 min-h-13 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base font-medium text-[var(--color-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-teal-100"
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
            className="mt-3 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-3 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        <div className="mt-5 space-y-2">
          <button
            className="min-h-13 w-full rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSaving || !hasProducts}
            onClick={() => handleSave("all")}
            type="button"
          >
            {savingMode === "all" ? "در حال ذخیره..." : "ذخیره همه محصولات"}
          </button>

          <button
            className="min-h-13 w-full rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-base font-black text-[var(--color-primary-strong)] transition hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            disabled={isSaving || !hasProducts}
            onClick={() => handleSave("best-only")}
            type="button"
          >
            {savingMode === "best-only"
              ? "در حال ذخیره..."
              : "فقط گزینه بصرفه‌تر"}
          </button>

          <button
            className="min-h-13 w-full rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
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
