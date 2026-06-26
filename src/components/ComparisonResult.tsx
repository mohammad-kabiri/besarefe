"use client";

import { useMemo } from "react";

import type { ComparedProduct } from "@/types/product";

import { getOutputUnitLabel } from "@/lib/constants";
import {
  compareProducts,
  getDisplayName,
  getRecommendation,
} from "@/lib/priceCalculator";
import { formatNumber, formatPercent, formatToman } from "@/lib/numberUtils";
import { useComparisonStore } from "@/store/comparisonStore";

function getResultItemClassName(
  product: ComparedProduct,
  cheapestId: string,
  mostExpensiveId: string,
  hasMultipleProducts: boolean
): string {
  const baseClassName = "rounded-[1.75rem] border p-4 shadow-sm";

  if (product.id === cheapestId) {
    return `${baseClassName} border-emerald-300 bg-emerald-50`;
  }

  if (hasMultipleProducts && product.id === mostExpensiveId) {
    return `${baseClassName} border-rose-200 bg-rose-50`;
  }

  return `${baseClassName} border-[var(--color-border)] bg-white`;
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
        <span className="rounded-full bg-[var(--color-success)] px-3 py-1 text-xs font-black text-white">
          بصرفه‌ترین
        </span>
      ) : null}
      {hasMultipleProducts && product.id === mostExpensiveId ? (
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
          گران‌ترین
        </span>
      ) : null}
      {product.hasDiscount ? (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
          تخفیف‌دار
        </span>
      ) : null}
    </div>
  );
}

export default function ComparisonResult() {
  const products = useComparisonStore((state) => state.products);
  const outputUnit = useComparisonStore((state) => state.outputUnit);
  const comparedProducts = useMemo(
    () => compareProducts(products, outputUnit),
    [products, outputUnit]
  );
  const recommendation = useMemo(
    () => getRecommendation(comparedProducts),
    [comparedProducts]
  );
  const outputUnitLabel = getOutputUnitLabel(outputUnit);

  if (comparedProducts.length < 1 || recommendation === null) {
    return (
      <section
        aria-labelledby="comparison-result-title"
        className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white p-6 text-center shadow-sm"
      >
        <h2
          id="comparison-result-title"
          className="text-xl font-black text-[var(--color-text)]"
        >
          نتیجه آماده نیست
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          حداقل یک محصول معتبر وارد کنید تا بصرفه‌ترین گزینه مشخص شود.
        </p>
      </section>
    );
  }

  const hasMultipleProducts = comparedProducts.length > 1;
  const cheapestId = recommendation.cheapest.id;
  const mostExpensiveId = recommendation.mostExpensive.id;

  return (
    <section aria-labelledby="comparison-result-title" className="space-y-4">
      <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
        <p className="text-sm font-black text-emerald-800">
          بصرفه‌ترین گزینه
        </p>
        <h2
          id="comparison-result-title"
          className="mt-1 text-2xl font-black text-emerald-950"
        >
          {getDisplayName(recommendation.cheapest)}
        </h2>
        <p className="mt-2 text-sm font-semibold text-emerald-800">
          این گزینه کمترین قیمت واحد را دارد.
        </p>

        <div className="mt-4 rounded-3xl bg-white/80 p-4">
          <p className="text-sm font-bold text-emerald-700">قیمت واحد</p>
          <p className="mt-1 text-2xl font-black text-emerald-950">
            {formatToman(recommendation.cheapest.unitPrice)}
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-800">
            برای {outputUnitLabel}
          </p>
        </div>

        {hasMultipleProducts ? (
          <p className="mt-3 rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">
            اختلاف ارزان‌ترین و گران‌ترین:{" "}
            {formatPercent(recommendation.diffPercent)}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-black text-[var(--color-text)]">
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
                <p className="text-xs font-black text-[var(--color-muted)]">
                  رتبه {formatNumber(index + 1)}
                </p>
                <h4 className="mt-1 break-words text-base font-black text-[var(--color-text)]">
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
                <dt className="text-[var(--color-muted)]">قیمت واحد</dt>
                <dd className="mt-1 text-xl font-black text-[var(--color-text)]">
                  {formatToman(product.unitPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">قیمت نهایی</dt>
                <dd className="mt-1 font-bold text-slate-900">
                  {formatToman(product.finalPrice)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs font-bold text-[var(--color-muted)]">
              {outputUnitLabel}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
