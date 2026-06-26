import type {
  DiscountType,
  OutputUnit,
  Unit,
  UnitFamily,
} from "@/types/product";

export const UNIT_LABELS: Record<Unit, string> = {
  g: "گرم",
  kg: "کیلوگرم",
  ml: "میلی‌لیتر",
  l: "لیتر",
};

export function getUnitLabel(unit: string): string {
  return (
    (UNIT_LABELS as Partial<Record<string, string>>)[unit] ?? "واحد نامشخص"
  );
}

export const OUTPUT_UNIT_LABELS: Record<OutputUnit, string> = {
  per_g: "قیمت به ازای هر گرم",
  per_100g: "قیمت به ازای هر ۱۰۰ گرم",
  per_kg: "قیمت به ازای هر کیلوگرم",
  per_ml: "قیمت به ازای هر میلی‌لیتر",
  per_100ml: "قیمت به ازای هر ۱۰۰ میلی‌لیتر",
  per_l: "قیمت به ازای هر لیتر",
};

export function getOutputUnitLabel(outputUnit: string): string {
  return (
    (OUTPUT_UNIT_LABELS as Partial<Record<string, string>>)[outputUnit] ??
    "واحد محاسبه نامشخص"
  );
}

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  none: "بدون تخفیف",
  percent: "درصدی",
  fixed: "مبلغ ثابت",
};

export type InputUnitOption = {
  value: Unit;
  label: string;
  family: UnitFamily;
};

export type OutputUnitOption = {
  value: OutputUnit;
  label: string;
  family: UnitFamily;
};

export const INPUT_UNIT_OPTIONS: InputUnitOption[] = [
  { value: "g", label: UNIT_LABELS.g, family: "mass" },
  { value: "kg", label: UNIT_LABELS.kg, family: "mass" },
  { value: "ml", label: UNIT_LABELS.ml, family: "volume" },
  { value: "l", label: UNIT_LABELS.l, family: "volume" },
];

export const OUTPUT_UNIT_OPTIONS: OutputUnitOption[] = [
  { value: "per_g", label: OUTPUT_UNIT_LABELS.per_g, family: "mass" },
  { value: "per_100g", label: OUTPUT_UNIT_LABELS.per_100g, family: "mass" },
  { value: "per_kg", label: OUTPUT_UNIT_LABELS.per_kg, family: "mass" },
  { value: "per_ml", label: OUTPUT_UNIT_LABELS.per_ml, family: "volume" },
  {
    value: "per_100ml",
    label: OUTPUT_UNIT_LABELS.per_100ml,
    family: "volume",
  },
  { value: "per_l", label: OUTPUT_UNIT_LABELS.per_l, family: "volume" },
];

export const MASS_OUTPUT_UNIT_OPTIONS = OUTPUT_UNIT_OPTIONS.filter(
  (option) => option.family === "mass"
);

export const VOLUME_OUTPUT_UNIT_OPTIONS = OUTPUT_UNIT_OPTIONS.filter(
  (option) => option.family === "volume"
);

export function getOutputUnitOptionsForFamily(
  family: UnitFamily
): OutputUnitOption[] {
  return family === "mass"
    ? MASS_OUTPUT_UNIT_OPTIONS
    : VOLUME_OUTPUT_UNIT_OPTIONS;
}

export const DISCOUNT_TYPE_OPTIONS: Array<{
  value: DiscountType;
  label: string;
}> = [
  { value: "none", label: DISCOUNT_TYPE_LABELS.none },
  { value: "percent", label: DISCOUNT_TYPE_LABELS.percent },
  { value: "fixed", label: DISCOUNT_TYPE_LABELS.fixed },
];

export const DEFAULT_INPUT_UNIT: Unit = "g";
export const DEFAULT_OUTPUT_UNIT: OutputUnit = "per_kg";
export const DEFAULT_DISCOUNT_TYPE: DiscountType = "none";
