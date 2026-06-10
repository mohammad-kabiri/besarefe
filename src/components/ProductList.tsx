"use client";

import ProductCard from "@/components/ProductCard";
import { useComparisonStore } from "@/store/comparisonStore";

export default function ProductList() {
  const products = useComparisonStore((state) => state.products);

  return (
    <section aria-labelledby="product-list-title" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="product-list-title" className="text-lg font-bold text-slate-950">
          محصولات
        </h2>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
          {products.length}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-600">
          هنوز محصولی اضافه نشده است.
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
