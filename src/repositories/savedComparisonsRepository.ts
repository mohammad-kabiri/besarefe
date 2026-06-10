import type { SaveMode, SavedComparison } from "@/types/comparison";
import type { OutputUnit, ProductInput } from "@/types/product";

import { db } from "@/lib/db";
import { compareProducts } from "@/lib/priceCalculator";

export type CreateSavedComparisonInput = {
  title?: string;
  products: ProductInput[];
  outputUnit: OutputUnit;
  saveMode: SaveMode;
};

function createSavedComparisonId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `saved_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getSavedProduct(product: ProductInput): ProductInput {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    amount: product.amount,
    unit: product.unit,
    originalPrice: product.originalPrice,
    discountType: product.discountType,
    discountValue: product.discountValue,
  };
}

function getProductsForSave(
  products: ProductInput[],
  outputUnit: OutputUnit,
  saveMode: SaveMode
): ProductInput[] {
  if (saveMode === "all") {
    return products.map(getSavedProduct);
  }

  const [cheapestProduct] = compareProducts(products, outputUnit);

  if (!cheapestProduct) {
    throw new Error("هیچ محصول معتبری برای ذخیره وجود ندارد.");
  }

  return [getSavedProduct(cheapestProduct)];
}

export async function saveComparison(
  input: CreateSavedComparisonInput
): Promise<SavedComparison> {
  const now = new Date().toISOString();
  const title = input.title?.trim() || "مقایسه قیمت";
  const savedComparison: SavedComparison = {
    id: createSavedComparisonId(),
    title,
    createdAt: now,
    updatedAt: now,
    outputUnit: input.outputUnit,
    products: getProductsForSave(input.products, input.outputUnit, input.saveMode),
    saveMode: input.saveMode,
  };

  await db.savedComparisons.put(savedComparison);

  return savedComparison;
}

export async function getSavedComparisons(): Promise<SavedComparison[]> {
  return db.savedComparisons.orderBy("updatedAt").reverse().toArray();
}

export async function getSavedComparisonById(
  id: string
): Promise<SavedComparison | undefined> {
  return db.savedComparisons.get(id);
}

export async function updateSavedComparison(
  id: string,
  updates: Partial<Omit<SavedComparison, "id" | "createdAt">>
): Promise<SavedComparison> {
  const existingComparison = await db.savedComparisons.get(id);

  if (!existingComparison) {
    throw new Error("مقایسه ذخیره‌شده پیدا نشد.");
  }

  const updatedComparison: SavedComparison = {
    ...existingComparison,
    ...updates,
    id: existingComparison.id,
    createdAt: existingComparison.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await db.savedComparisons.put(updatedComparison);

  return updatedComparison;
}

export async function deleteSavedComparison(id: string): Promise<void> {
  await db.savedComparisons.delete(id);
}
