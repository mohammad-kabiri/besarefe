"use client";

import ProductCard from "@/components/ProductCard";
import { formatNumber } from "@/lib/numberUtils";
import { useComparisonStore } from "@/store/comparisonStore";

export default function ProductList() {
  const products = useComparisonStore((state) => state.products);

  return (
    <section aria-labelledby="product-list-title" className="space-y-3">
      <div>
        <h2 id="product-list-title" className="text-xl font-black text-[var(--color-text)]">
          محصولات واردشده
        </h2>
        {products.length > 0 ? (
          <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
            {formatNumber(products.length)} محصول
          </p>
        ) : null}
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white px-5 py-10 text-center shadow-sm">
          <p className="text-lg font-black text-[var(--color-text)]">
            هنوز محصولی اضافه نشده است.
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            اولین محصول را از فرم بالا وارد کنید.
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
