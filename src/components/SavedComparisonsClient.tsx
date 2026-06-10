"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { SavedComparison } from "@/types/comparison";

import SavedComparisonCard from "@/components/SavedComparisonCard";
import {
  deleteSavedComparison,
  getSavedComparisons,
  updateSavedComparison,
} from "@/repositories/savedComparisonsRepository";
import { useComparisonStore } from "@/store/comparisonStore";

export default function SavedComparisonsClient() {
  const router = useRouter();
  const loadComparison = useComparisonStore((state) => state.loadComparison);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getSavedComparisons()
      .then((comparisons) => {
        if (!active) {
          return;
        }

        setSavedComparisons(comparisons);
        setError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError("دریافت مقایسه‌های ذخیره‌شده ناموفق بود.");
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleLoad(comparison: SavedComparison) {
    loadComparison(comparison.products, comparison.outputUnit);
    router.push("/");
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("آیا از حذف این مقایسه مطمئن هستید؟");

    if (!confirmed) {
      return;
    }

    try {
      await deleteSavedComparison(id);
      setSavedComparisons((currentComparisons) =>
        currentComparisons.filter((comparison) => comparison.id !== id)
      );
      setError(null);
    } catch {
      setError("حذف مقایسه ذخیره‌شده ناموفق بود.");
    }
  }

  async function handleRename(id: string, title: string) {
    const nextTitle = title.trim();

    if (nextTitle === "") {
      return;
    }

    try {
      const updatedComparison = await updateSavedComparison(id, {
        title: nextTitle,
      });
      setSavedComparisons((currentComparisons) =>
        currentComparisons.map((comparison) =>
          comparison.id === id ? updatedComparison : comparison
        )
      );
      setError(null);
    } catch {
      setError("ویرایش عنوان مقایسه ناموفق بود.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:py-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-emerald-700">
          ذخیره‌شده‌ها
        </p>
        <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
          مقایسه‌های ذخیره‌شده
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600">
          مقایسه‌هایی که روی همین دستگاه ذخیره کرده‌اید اینجا نمایش داده می‌شوند.
        </p>
      </header>

      {error ? (
        <p
          className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <p className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
        </section>
      ) : null}

      {!loading && savedComparisons.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-800">
            هنوز مقایسه‌ای ذخیره نشده است.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            از صفحه مقایسه، محصولات را وارد کنید و گزینه ذخیره مقایسه را بزنید.
          </p>
          <Link
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            href="/"
          >
            شروع مقایسه جدید
          </Link>
        </section>
      ) : null}

      {!loading && savedComparisons.length > 0 ? (
        <section
          aria-label="فهرست مقایسه‌های ذخیره‌شده"
          className="space-y-3"
        >
          {savedComparisons.map((comparison) => (
            <SavedComparisonCard
              comparison={comparison}
              key={comparison.id}
              onDelete={handleDelete}
              onLoad={handleLoad}
              onRename={handleRename}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
