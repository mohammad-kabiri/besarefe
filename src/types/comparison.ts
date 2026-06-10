import type {
  ComparedProduct,
  OutputUnit,
  ProductInput,
} from "@/types/product";

export type SaveMode = "all" | "best-only";

export type SavedComparison = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  outputUnit: OutputUnit;
  products: ProductInput[];
  saveMode: SaveMode;
};

export type RecommendationResult = {
  cheapest: ComparedProduct;
  mostExpensive: ComparedProduct;
  diffPercent: number;
};
