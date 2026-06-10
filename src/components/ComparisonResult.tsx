"use client";

import type { ComparedProduct } from "@/types/product";

import { OUTPUT_UNIT_LABELS } from "@/lib/constants";
import { getDisplayName } from "@/lib/priceCalculator";
import { formatNumber, formatPercent, formatToman } from "@/lib/numberUtils";
import { useComparisonStore } from "@/store/comparisonStore";
import {
  selectComparedProducts,
  selectCurrentRecommendation,
} from "@/store/comparisonSelectors";

function getResultItemClassName(
  product: ComparedProduct,
  cheapestId: string,
  mostExpensiveId: string,
  hasMultipleProducts: boolean
): string {
  const baseClassName = "rounded-3xl border p-4 shadow-sm";

  if (product.id === cheapestId) {
    return `${baseClassName} border-emerald-300 bg-emerald-50`;
  }

  if (hasMultipleProducts && product.id === mostExpensiveId) {
    return `${baseClassName} border-red-200 bg-red-50`;
  }

  return `${baseClassName} border-slate-200 bg-white`;
}

function getResultBadges(
  product: ComparedProduct,
  cheapestId: string,
  mostExpensiveId: string,
  hasMultipleProducts: boolean
) {
  return (
    <div className="flex flex-wrap gap-2">
      {product.id === cheapestId ? (
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          به‌صرفه‌ترین
        </span>
      ) : null}
      {hasMultipleProducts && product.id === mostExpensiveId ? (
        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
          گران‌ترین
        </span>
      ) : null}
      {product.hasDiscount ? (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          تخفیف
        </span>
      ) : null}
    </div>
  );
}

export default function ComparisonResult() {
  const comparedProducts = useComparisonStore(selectComparedProducts);
  const recommendation = useComparisonStore(selectCurrentRecommendation);
  const outputUnit = useComparisonStore((state) => state.outputUnit);
  const outputUnitLabel = OUTPUT_UNIT_LABELS[outputUnit];

  if (comparedProducts.length < 1 || recommendation === null) {
    return (
      <section
        aria-labelledby="comparison-result-title"
        className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm"
      >
        <h2
          id="comparison-result-title"
          className="text-lg font-bold text-slate-950"
        >
          هنوز نتیجه‌ای برای نمایش وجود ندارد.
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          حداقل یک محصول معتبر وارد کنید و مطمئن شوید واحد خروجی با نوع محصول
          سازگار است.
        </p>
      </section>
    );
  }

  const hasMultipleProducts = comparedProducts.length > 1;
  const cheapestId = recommendation.cheapest.id;
  const mostExpensiveId = recommendation.mostExpensive.id;

  return (
    <section aria-labelledby="comparison-result-title" className="space-y-4">
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <p className="text-sm font-bold text-emerald-800">
          به‌صرفه‌ترین گزینه
        </p>
        <h2
          id="comparison-result-title"
          className="mt-1 text-2xl font-black text-emerald-950"
        >
          {getDisplayName(recommendation.cheapest)}
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-white/75 p-3">
            <dt className="text-emerald-700">قیمت واحد</dt>
            <dd className="mt-1 text-lg font-black text-emerald-950">
              {formatToman(recommendation.cheapest.unitPrice)}
            </dd>
          </div>
          <div className="rounded-2xl bg-white/75 p-3">
            <dt className="text-emerald-700">واحد مقایسه</dt>
            <dd className="mt-1 font-bold text-emerald-950">
              {outputUnitLabel}
            </dd>
          </div>
        </dl>

        {hasMultipleProducts ? (
          <p className="mt-3 rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">
            اختلاف ارزان‌ترین و گران‌ترین:{" "}
            {formatPercent(recommendation.diffPercent)}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-950">
          رتبه‌بندی قیمت واحد
        </h3>
        {comparedProducts.map((product, index) => (
          <article
            className={getResultItemClassName(
              product,
              cheapestId,
              mostExpensiveId,
              hasMultipleProducts
            )}
            key={product.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500">
                  #{formatNumber(index + 1)}
                </p>
                <h4 className="mt-1 break-words text-base font-bold text-slate-950">
                  {getDisplayName(product)}
                </h4>
              </div>
              {getResultBadges(
                product,
                cheapestId,
                mostExpensiveId,
                hasMultipleProducts
              )}
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">قیمت واحد</dt>
                <dd className="mt-1 text-lg font-black text-slate-950">
                  {formatToman(product.unitPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">قیمت نهایی</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatToman(product.finalPrice)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs font-medium text-slate-500">
              {outputUnitLabel}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
