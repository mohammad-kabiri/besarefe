import type {
  ComparedProduct,
  DiscountType,
  OutputUnit,
  ProductInput,
  Unit,
  UnitFamily,
} from "@/types/product";

import type { RecommendationResult } from "@/types/comparison";

import {
  getUnitFamily,
  MASS_UNIT_TO_GRAM,
  VOLUME_UNIT_TO_ML,
} from "@/lib/units";

const INCOMPATIBLE_UNIT_MESSAGE =
  "Cannot compare mass and volume units without density.";

function getValidDiscountValue(discountValue: number): number {
  return Number.isFinite(discountValue) ? discountValue : 0;
}

export function applyDiscount(
  originalPrice: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (!Number.isFinite(originalPrice) || originalPrice < 0) {
    return 0;
  }

  const validDiscountValue = getValidDiscountValue(discountValue);

  switch (discountType) {
    case "none":
      return Math.round(originalPrice);
    case "percent": {
      const percent = Math.min(Math.max(validDiscountValue, 0), 100);
      return Math.round(originalPrice * (1 - percent / 100));
    }
    case "fixed": {
      const fixedDiscount = Math.max(validDiscountValue, 0);
      return Math.round(Math.max(originalPrice - fixedDiscount, 0));
    }
    default: {
      const exhaustiveCheck: never = discountType;
      return exhaustiveCheck;
    }
  }
}

export function getOutputUnitFamily(outputUnit: OutputUnit): UnitFamily {
  switch (outputUnit) {
    case "per_g":
    case "per_100g":
    case "per_kg":
      return "mass";
    case "per_ml":
    case "per_100ml":
    case "per_l":
      return "volume";
    default: {
      const exhaustiveCheck: never = outputUnit;
      return exhaustiveCheck;
    }
  }
}

export function getOutputUnitFactor(outputUnit: OutputUnit): number {
  switch (outputUnit) {
    case "per_g":
    case "per_ml":
      return 1;
    case "per_100g":
    case "per_100ml":
      return 100;
    case "per_kg":
    case "per_l":
      return 1000;
    default: {
      const exhaustiveCheck: never = outputUnit;
      return exhaustiveCheck;
    }
  }
}

export function normalizeAmount(amount: number, unit: Unit): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a finite number greater than zero.");
  }

  switch (unit) {
    case "g":
    case "kg":
      return amount * MASS_UNIT_TO_GRAM[unit];
    case "ml":
    case "l":
      return amount * VOLUME_UNIT_TO_ML[unit];
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}

export function assertCompatibleUnit(
  productUnit: Unit,
  outputUnit: OutputUnit
): void {
  if (getUnitFamily(productUnit) !== getOutputUnitFamily(outputUnit)) {
    throw new Error(INCOMPATIBLE_UNIT_MESSAGE);
  }
}

export function calculateUnitPrice(
  product: ProductInput,
  outputUnit: OutputUnit
): number {
  assertCompatibleUnit(product.unit, outputUnit);

  const normalizedAmount = normalizeAmount(product.amount, product.unit);
  const finalPrice = applyDiscount(
    product.originalPrice,
    product.discountType,
    product.discountValue
  );
  const outputUnitFactor = getOutputUnitFactor(outputUnit);

  return (finalPrice / normalizedAmount) * outputUnitFactor;
}

export function hasAppliedDiscount(product: ProductInput): boolean {
  if (
    product.discountType === "none" ||
    !Number.isFinite(product.discountValue) ||
    product.discountValue <= 0
  ) {
    return false;
  }

  return (
    applyDiscount(
      product.originalPrice,
      product.discountType,
      product.discountValue
    ) < product.originalPrice
  );
}

export function compareProducts(
  products: ProductInput[],
  outputUnit: OutputUnit
): ComparedProduct[] {
  const comparedProducts: ComparedProduct[] = [];

  for (const product of products) {
    try {
      comparedProducts.push({
        ...product,
        finalPrice: applyDiscount(
          product.originalPrice,
          product.discountType,
          product.discountValue
        ),
        unitPrice: calculateUnitPrice(product, outputUnit),
        hasDiscount: hasAppliedDiscount(product),
      });
    } catch {
      continue;
    }
  }

  return comparedProducts.sort((a, b) => a.unitPrice - b.unitPrice);
}

export function getRecommendation(
  comparedProducts: ComparedProduct[]
): RecommendationResult | null {
  if (comparedProducts.length === 0) {
    return null;
  }

  const sortedProducts = [...comparedProducts].sort(
    (a, b) => a.unitPrice - b.unitPrice
  );
  const cheapest = sortedProducts[0];
  const mostExpensive = sortedProducts[sortedProducts.length - 1];
  const diffPercent =
    cheapest.unitPrice > 0
      ? ((mostExpensive.unitPrice - cheapest.unitPrice) / cheapest.unitPrice) *
        100
      : 0;

  return {
    cheapest,
    mostExpensive,
    diffPercent,
  };
}

export function getDisplayName(product: ProductInput): string {
  const name = product.name.trim();
  const brand = product.brand?.trim();

  return brand ? `${name} - ${brand}` : name;
}
