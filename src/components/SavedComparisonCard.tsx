"use client";

import { useState } from "react";

import type { SavedComparison } from "@/types/comparison";

import { OUTPUT_UNIT_LABELS } from "@/lib/constants";
import { formatNumber, formatPercent, formatToman } from "@/lib/numberUtils";
import {
  compareProducts,
  getDisplayName,
  getRecommendation,
} from "@/lib/priceCalculator";

type SavedComparisonCardProps = {
  comparison: SavedComparison;
  onLoad: (comparison: SavedComparison) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("fa-IR");
}

function getSaveModeLabel(saveMode: SavedComparison["saveMode"]): string {
  switch (saveMode) {
    case "all":
      return "همه محصولات";
    case "best-only":
      return "فقط بصرفه‌ترین";
    default: {
      const exhaustiveCheck: never = saveMode;
      return exhaustiveCheck;
    }
  }
}

export default function SavedComparisonCard({
  comparison,
  onLoad,
  onDelete,
  onRename,
}: SavedComparisonCardProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(comparison.title);
  const comparedProducts = compareProducts(
    comparison.products,
    comparison.outputUnit
  );
  const recommendation = getRecommendation(comparedProducts);
  const createdAt = formatDateTime(comparison.createdAt);
  const updatedAt = formatDateTime(comparison.updatedAt);
  const showUpdatedAt = comparison.updatedAt !== comparison.createdAt;

  function handleSaveTitle() {
    const nextTitle = titleDraft.trim();

    if (nextTitle === "") {
      return;
    }

    onRename(comparison.id, nextTitle);
    setEditingTitle(false);
  }

  function handleCancelEdit() {
    setTitleDraft(comparison.title);
    setEditingTitle(false);
  }

  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-5">
      <div className="space-y-4">
        {editingTitle ? (
          <div className="space-y-3 rounded-3xl border border-teal-200 bg-teal-50 p-3">
            <label className="block" htmlFor={`title-${comparison.id}`}>
              <span className="mb-1 block text-sm font-bold text-[var(--color-primary-strong)]">
                عنوان
              </span>
              <input
                className="h-13 min-h-13 w-full rounded-2xl border border-teal-200 bg-white px-4 text-base font-medium text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-teal-100"
                id={`title-${comparison.id}`}
                onChange={(event) => setTitleDraft(event.target.value)}
                type="text"
                value={titleDraft}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="min-h-12 rounded-2xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                disabled={titleDraft.trim() === ""}
                onClick={handleSaveTitle}
                type="button"
              >
                ذخیره عنوان
              </button>
              <button
                className="min-h-12 rounded-2xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                onClick={handleCancelEdit}
                type="button"
              >
                لغو
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <h2 className="break-words text-xl font-black text-[var(--color-text)]">
                {comparison.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                ایجاد: {createdAt}
              </p>
              {showUpdatedAt ? (
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  ویرایش: {updatedAt}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-[var(--color-primary-strong)]">
                {getSaveModeLabel(comparison.saveMode)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {formatNumber(comparison.products.length)} محصول
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {OUTPUT_UNIT_LABELS[comparison.outputUnit]}
              </span>
            </div>
          </div>
        )}

        {recommendation ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <p className="font-black text-emerald-950">
              بصرفه‌ترین: {getDisplayName(recommendation.cheapest)}
            </p>
            <p className="mt-1 text-emerald-800">
              قیمت واحد: {formatToman(recommendation.cheapest.unitPrice)}
            </p>
            {comparedProducts.length > 1 ? (
              <p className="mt-1 text-emerald-800">
                اختلاف ارزان‌ترین و گران‌ترین:{" "}
                {formatPercent(recommendation.diffPercent)}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="rounded-3xl border border-amber-200 bg-[var(--color-warning-soft)] px-3 py-2 text-sm leading-7 text-amber-800">
            نتیجه قابل محاسبه‌ای برای این ذخیره وجود ندارد.
          </p>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            className="min-h-12 rounded-2xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-teal-100"
            onClick={() => onLoad(comparison)}
            type="button"
          >
            بارگذاری
          </button>
          <button
            className="min-h-12 rounded-2xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={() => setEditingTitle(true)}
            type="button"
          >
            ویرایش عنوان
          </button>
          <button
            className="min-h-12 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
            onClick={() => onDelete(comparison.id)}
            type="button"
          >
            حذف
          </button>
        </div>
      </div>
    </article>
  );
}
