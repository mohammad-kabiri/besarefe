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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:py-8">
      <section className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-bold text-[var(--color-primary)]">
          آرشیو محلی بصرفه
        </p>
        <h1 className="mt-1 text-3xl font-black text-[var(--color-text)] sm:text-4xl">
          ذخیره‌شده‌ها
        </h1>
        <p className="mt-2 max-w-xl text-base leading-8 text-[var(--color-muted)]">
          مقایسه‌هایی که روی همین دستگاه ذخیره کرده‌اید.
        </p>
      </section>

      {error ? (
        <p
          className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <section className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <p className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <p className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
        </section>
      ) : null}

      {!loading && savedComparisons.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white px-5 py-10 text-center shadow-sm">
          <p className="text-xl font-black text-[var(--color-text)]">
            هنوز چیزی ذخیره نشده است.
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            یک مقایسه بسازید و آن را برای بعد نگه دارید.
          </p>
          <Link
            className="mt-5 inline-flex min-h-13 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-teal-100"
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
