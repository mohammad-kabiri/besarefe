export type UnitFamily = "mass" | "volume";

export type MassUnit = "g" | "kg" | "mithqal" | "ounce" | "pound";

export type VolumeUnit = "ml" | "l";

export type Unit = MassUnit | VolumeUnit;

export type OutputUnit =
  | "per_g"
  | "per_100g"
  | "per_kg"
  | "per_ml"
  | "per_100ml"
  | "per_l";

export type DiscountType = "none" | "percent" | "fixed";

export type ProductInput = {
  id: string;
  name: string;
  brand?: string;
  amount: number;
  unit: Unit;
  originalPrice: number;
  discountType: DiscountType;
  discountValue: number;
};

export type ComparedProduct = ProductInput & {
  finalPrice: number;
  unitPrice: number;
  hasDiscount: boolean;
};
