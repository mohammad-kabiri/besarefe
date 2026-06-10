"use client";

import { useState } from "react";

import type { SavedComparison } from "@/types/comparison";

import { OUTPUT_UNIT_LABELS } from "@/lib/constants";
import { formatPercent, formatToman } from "@/lib/numberUtils";
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
      return "فقط به‌صرفه‌ترین محصول";
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
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="space-y-3">
        {editingTitle ? (
          <div className="space-y-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-800">
                عنوان
              </span>
              <input
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => setTitleDraft(event.target.value)}
                type="text"
                value={titleDraft}
              />
            </label>
            <div className="flex gap-2">
              <button
                className="min-h-11 flex-1 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                disabled={titleDraft.trim() === ""}
                onClick={handleSaveTitle}
                type="button"
              >
                ذخیره عنوان
              </button>
              <button
                className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                onClick={handleCancelEdit}
                type="button"
              >
                لغو
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {comparison.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                ایجاد: {createdAt}
              </p>
              {showUpdatedAt ? (
                <p className="mt-1 text-sm text-slate-500">
                  ویرایش: {updatedAt}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {getSaveModeLabel(comparison.saveMode)}
            </span>
          </div>
        )}

        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">تعداد محصولات</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {comparison.products.length}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">واحد خروجی</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {OUTPUT_UNIT_LABELS[comparison.outputUnit]}
            </dd>
          </div>
        </dl>

        {recommendation ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <p className="font-semibold text-emerald-950">
              به‌صرفه‌ترین: {getDisplayName(recommendation.cheapest)}
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
        ) : null}

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            className="min-h-11 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            onClick={() => onLoad(comparison)}
            type="button"
          >
            بارگذاری
          </button>
          <button
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            onClick={() => setEditingTitle(true)}
            type="button"
          >
            ویرایش عنوان
          </button>
          <button
            className="min-h-11 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
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
