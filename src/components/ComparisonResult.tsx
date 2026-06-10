"use client";

import type { ComparedProduct } from "@/types/product";

import { OUTPUT_UNIT_LABELS } from "@/lib/constants";
import { getDisplayName } from "@/lib/priceCalculator";
import { formatPercent, formatToman } from "@/lib/numberUtils";
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
  const baseClassName = "rounded-2xl border p-4";

  if (product.id === cheapestId) {
    return `${baseClassName} border-emerald-300 bg-emerald-50`;
  }

  if (hasMultipleProducts && product.id === mostExpensiveId) {
    return `${baseClassName} border-red-200 bg-red-50`;
  }

  return `${baseClassName} border-slate-200 bg-white`;
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
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <h2
          id="comparison-result-title"
          className="text-lg font-bold text-slate-950"
        >
          نتیجه مقایسه
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          برای مشاهده نتیجه، حداقل یک محصول معتبر وارد کنید.
        </p>
      </section>
    );
  }

  const hasMultipleProducts = comparedProducts.length > 1;
  const cheapestId = recommendation.cheapest.id;
  const mostExpensiveId = recommendation.mostExpensive.id;

  return (
    <section
      aria-labelledby="comparison-result-title"
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div>
        <h2
          id="comparison-result-title"
          className="text-lg font-bold text-slate-950"
        >
          نتیجه مقایسه
        </h2>
        <p className="mt-1 text-sm text-slate-600">{outputUnitLabel}</p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-medium text-emerald-800">
          به‌صرفه‌ترین گزینه
        </p>
        <h3 className="mt-1 text-lg font-bold text-emerald-950">
          {getDisplayName(recommendation.cheapest)}
        </h3>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-emerald-700">قیمت واحد</dt>
            <dd className="mt-1 font-bold text-emerald-950">
              {formatToman(recommendation.cheapest.unitPrice)}
            </dd>
          </div>
          <div>
            <dt className="text-emerald-700">واحد مقایسه</dt>
            <dd className="mt-1 font-bold text-emerald-950">
              {outputUnitLabel}
            </dd>
          </div>
        </dl>

        {hasMultipleProducts ? (
          <p className="mt-3 text-sm font-semibold text-emerald-900">
            اختلاف ارزان‌ترین و گران‌ترین:{" "}
            {formatPercent(recommendation.diffPercent)}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        {comparedProducts.map((product) => (
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
              <div>
                <h3 className="font-bold text-slate-950">
                  {getDisplayName(product)}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  قیمت واحد: {formatToman(product.unitPrice)}
                </p>
              </div>

              {product.hasDiscount ? (
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  ٪ تخفیف
                </span>
              ) : null}
            </div>

            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">قیمت نهایی</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatToman(product.finalPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">واحد خروجی</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {outputUnitLabel}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
