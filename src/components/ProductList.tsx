"use client";

import ProductCard from "@/components/ProductCard";
import { formatNumber } from "@/lib/numberUtils";
import { useComparisonStore } from "@/store/comparisonStore";

export default function ProductList() {
  const products = useComparisonStore((state) => state.products);

  return (
    <section aria-labelledby="product-list-title" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="product-list-title" className="text-lg font-bold text-slate-950">
            محصولات
          </h2>
          {products.length > 0 ? (
            <p className="mt-1 text-sm text-slate-500">
              تعداد محصولات: {formatNumber(products.length)}
            </p>
          ) : null}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-base font-bold text-slate-800">
            هنوز محصولی اضافه نشده است.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            اولین محصول را از فرم بالا وارد کنید تا مقایسه شروع شود.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
