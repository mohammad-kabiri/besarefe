"use client";

import type { ProductInput } from "@/types/product";

import { DISCOUNT_TYPE_LABELS, getUnitLabel } from "@/lib/constants";
import {
  applyDiscount,
  getDisplayName,
  hasAppliedDiscount,
} from "@/lib/priceCalculator";
import { formatNumber, formatToman } from "@/lib/numberUtils";
import { useComparisonStore } from "@/store/comparisonStore";

type ProductCardProps = {
  product: ProductInput;
};

function getDiscountText(product: ProductInput): string {
  if (!hasAppliedDiscount(product)) {
    return "";
  }

  if (product.discountType === "percent") {
    return `${formatNumber(product.discountValue)} درصد`;
  }

  if (product.discountType === "fixed") {
    return formatToman(product.discountValue);
  }

  return "";
}

export default function ProductCard({ product }: ProductCardProps) {
  const removeProduct = useComparisonStore((state) => state.removeProduct);
  const setEditingProduct = useComparisonStore(
    (state) => state.setEditingProduct
  );
  const displayName = getDisplayName(product);
  const isDiscounted = hasAppliedDiscount(product);
  const finalPrice = applyDiscount(
    product.originalPrice,
    product.discountType,
    product.discountValue
  );

  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-black text-[var(--color-text)]">
            {displayName}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {formatNumber(product.amount)} {getUnitLabel(product.unit)}
            </span>
            {isDiscounted ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                تخفیف‌دار
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--color-muted)]">قیمت اصلی</dt>
          <dd className="mt-1 font-bold text-slate-900">
            {formatToman(product.originalPrice)}
          </dd>
        </div>

        <div>
          <dt className="text-[var(--color-muted)]">قیمت نهایی</dt>
          <dd className="mt-1 text-lg font-black text-[var(--color-primary-strong)]">
            {formatToman(finalPrice)}
          </dd>
        </div>

        {isDiscounted ? (
          <div className="rounded-2xl bg-[var(--color-warning-soft)] px-3 py-2 sm:col-span-2">
            <dt className="text-amber-700">تخفیف</dt>
            <dd className="mt-1 font-bold text-amber-950">
              {DISCOUNT_TYPE_LABELS[product.discountType]}،{" "}
              {getDiscountText(product)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          aria-label={`ویرایش ${displayName}`}
          className="min-h-12 rounded-2xl border border-[var(--color-border)] bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-100"
          onClick={() => setEditingProduct(product.id)}
          type="button"
        >
          ویرایش
        </button>
        <button
          aria-label={`حذف ${displayName}`}
          className="min-h-12 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
          onClick={() => removeProduct(product.id)}
          type="button"
        >
          حذف
        </button>
      </div>
    </article>
  );
}
