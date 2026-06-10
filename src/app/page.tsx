import ComparisonResult from "@/components/ComparisonResult";
import OutputUnitSelector from "@/components/OutputUnitSelector";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import SaveCurrentComparisonButton from "@/components/SaveCurrentComparisonButton";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:py-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-emerald-700">
          price-unit-compare
        </p>
        <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
          مقایسه قیمت واحد
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600">
          محصولات را وارد کنید تا ارزان‌ترین گزینه بر اساس وزن یا حجم مشخص شود.
        </p>
      </header>

      <ProductForm />
      <OutputUnitSelector />
      <ProductList />
      <ComparisonResult />
      <SaveCurrentComparisonButton />
    </main>
  );
}
