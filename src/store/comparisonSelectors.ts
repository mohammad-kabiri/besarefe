import type { RecommendationResult } from "@/types/comparison";
import type { ComparedProduct, ProductInput } from "@/types/product";
import type { ComparisonState } from "@/store/comparisonStore";

import {
  compareProducts,
  getRecommendation,
} from "@/lib/priceCalculator";

export function selectComparedProducts(
  state: ComparisonState
): ComparedProduct[] {
  return compareProducts(state.products, state.outputUnit);
}

export function selectCurrentRecommendation(
  state: ComparisonState
): RecommendationResult | null {
  return getRecommendation(selectComparedProducts(state));
}

export function selectEditingProduct(
  state: ComparisonState
): ProductInput | null {
  if (state.editingProductId === null) {
    return null;
  }

  return (
    state.products.find((product) => product.id === state.editingProductId) ??
    null
  );
}

export function selectProductCount(state: ComparisonState): number {
  return state.products.length;
}
