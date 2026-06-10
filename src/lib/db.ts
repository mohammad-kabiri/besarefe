import Dexie, { type Table } from "dexie";

import type { SavedComparison } from "@/types/comparison";

export class PriceCompareDatabase extends Dexie {
  savedComparisons!: Table<SavedComparison, string>;

  constructor() {
    super("priceUnitCompareDb");

    this.version(1).stores({
      savedComparisons: "id, createdAt, updatedAt, saveMode",
    });
  }
}

export const db = new PriceCompareDatabase();
