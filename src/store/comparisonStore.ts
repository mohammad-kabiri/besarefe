"use client";

import { create } from "zustand";

import type { OutputUnit, ProductInput } from "@/types/product";

import { DEFAULT_OUTPUT_UNIT } from "@/lib/constants";

export type ComparisonState = {
  products: ProductInput[];
  outputUnit: OutputUnit;
  editingProductId: string | null;
};

export type ComparisonActions = {
  addProduct: (
    product: Omit<ProductInput, "id"> & { id?: string }
  ) => ProductInput;
  updateProduct: (
    id: string,
    updates: Partial<Omit<ProductInput, "id">>
  ) => void;
  removeProduct: (id: string) => void;
  setOutputUnit: (outputUnit: OutputUnit) => void;
  setEditingProduct: (id: string | null) => void;
  clearComparison: () => void;
  loadComparison: (products: ProductInput[], outputUnit?: OutputUnit) => void;
};

export type ComparisonStore = ComparisonState & ComparisonActions;

function createProductId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `product_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function ensureProductId(product: ProductInput): ProductInput {
  const id = product.id.trim() === "" ? createProductId() : product.id;

  return {
    ...product,
    id,
  };
}

export const useComparisonStore = create<ComparisonStore>()((set, get) => ({
  products: [],
  outputUnit: DEFAULT_OUTPUT_UNIT,
  editingProductId: null,

  addProduct: (product) => {
    const insertedProduct: ProductInput = {
      ...product,
      id: product.id?.trim() ? product.id : createProductId(),
    };

    set((state) => ({
      products: [...state.products, insertedProduct],
    }));

    return insertedProduct;
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updates,
              id: product.id,
            }
          : product
      ),
    }));
  },

  removeProduct: (id) => {
    set((state) => {
      const nextProducts = state.products.filter((product) => product.id !== id);

      if (nextProducts.length === state.products.length) {
        return {};
      }

      return {
        products: nextProducts,
        editingProductId:
          state.editingProductId === id ? null : state.editingProductId,
      };
    });
  },

  setOutputUnit: (outputUnit) => {
    set({ outputUnit });
  },

  setEditingProduct: (id) => {
    if (id === null) {
      set({ editingProductId: null });
      return;
    }

    const productExists = get().products.some((product) => product.id === id);

    set({
      editingProductId: productExists ? id : null,
    });
  },

  clearComparison: () => {
    set({
      products: [],
      outputUnit: DEFAULT_OUTPUT_UNIT,
      editingProductId: null,
    });
  },

  loadComparison: (products, outputUnit = DEFAULT_OUTPUT_UNIT) => {
    set({
      products: products.map(ensureProductId),
      outputUnit,
      editingProductId: null,
    });
  },
}));

export const useProducts = () =>
  useComparisonStore((state) => state.products);

export const useOutputUnit = () =>
  useComparisonStore((state) => state.outputUnit);
