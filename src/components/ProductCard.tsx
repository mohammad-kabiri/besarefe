"use client";

import type { ProductInput } from "@/types/product";

import { DISCOUNT_TYPE_LABELS, UNIT_LABELS } from "@/lib/constants";
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
  const isDiscounted = hasAppliedDiscount(product);
  const finalPrice = applyDiscount(
    product.originalPrice,
    product.discountType,
    product.discountValue
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">
            {getDisplayName(product)}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {formatNumber(product.amount)} {UNIT_LABELS[product.unit]}
          </p>
        </div>

        {isDiscounted ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            ٪ تخفیف
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">قیمت اصلی</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {formatToman(product.originalPrice)}
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">قیمت نهایی</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {formatToman(finalPrice)}
          </dd>
        </div>

        {isDiscounted ? (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">تخفیف</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {DISCOUNT_TYPE_LABELS[product.discountType]}،{" "}
              {getDiscountText(product)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 flex gap-2">
        <button
          className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          onClick={() => setEditingProduct(product.id)}
          type="button"
        >
          ویرایش
        </button>
        <button
          className="min-h-11 flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
          onClick={() => removeProduct(product.id)}
          type="button"
        >
          حذف
        </button>
      </div>
    </article>
  );
}
