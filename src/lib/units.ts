import type { MassUnit, Unit, UnitFamily, VolumeUnit } from "@/types/product";

export const MASS_UNIT_TO_GRAM: Record<MassUnit, number> = {
  g: 1,
  kg: 1000,
  mithqal: 4.608,
  ounce: 28.3495,
  pound: 453.592,
};

export const VOLUME_UNIT_TO_ML: Record<VolumeUnit, number> = {
  ml: 1,
  l: 1000,
};

export function isMassUnit(unit: Unit): unit is MassUnit {
  return unit in MASS_UNIT_TO_GRAM;
}

export function isVolumeUnit(unit: Unit): unit is VolumeUnit {
  return unit in VOLUME_UNIT_TO_ML;
}

export function getUnitFamily(unit: Unit): UnitFamily {
  if (isMassUnit(unit)) {
    return "mass";
  }

  if (isVolumeUnit(unit)) {
    return "volume";
  }

  const exhaustiveCheck: never = unit;
  return exhaustiveCheck;
}

export function getBaseUnitLabel(family: UnitFamily): "g" | "ml" {
  switch (family) {
    case "mass":
      return "g";
    case "volume":
      return "ml";
    default: {
      const exhaustiveCheck: never = family;
      return exhaustiveCheck;
    }
  }
}
