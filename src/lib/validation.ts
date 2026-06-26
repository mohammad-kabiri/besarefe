import type { OutputUnit, ProductInput, UnitFamily } from "@/types/product";

import { getOutputUnitFamily } from "@/lib/priceCalculator";
import { getUnitFamily } from "@/lib/units";

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

const COMPATIBILITY_ERROR_MESSAGE =
  "واحد خروجی انتخاب‌شده با واحد برخی محصولات سازگار نیست. وزن و حجم بدون چگالی قابل تبدیل به هم نیستند.";

function createValidationResult(errors: ValidationError[]): ValidationResult {
  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidName(product: ProductInput): boolean {
  return product.name.trim() !== "";
}

function isValidAmount(product: ProductInput): boolean {
  return Number.isFinite(product.amount) && product.amount > 0;
}

function getProductFamily(product: ProductInput): UnitFamily | null {
  try {
    return getUnitFamily(product.unit);
  } catch {
    return null;
  }
}

export function validateProductInput(
  product: ProductInput
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isValidName(product)) {
    errors.push({
      field: "name",
      message: "نام محصول الزامی است.",
    });
  }

  if (!isValidAmount(product)) {
    errors.push({
      field: "amount",
      message: "وزن یا حجم باید بزرگ‌تر از صفر باشد.",
    });
  }

  if (!Number.isFinite(product.originalPrice) || product.originalPrice < 0) {
    errors.push({
      field: "originalPrice",
      message: "قیمت اصلی باید عددی معتبر و غیرمنفی باشد.",
    });
  }

  switch (product.discountType) {
    case "none":
      break;
    case "percent":
      if (
        !Number.isFinite(product.discountValue) ||
        product.discountValue < 0 ||
        product.discountValue > 100
      ) {
        errors.push({
          field: "discountValue",
          message: "درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.",
        });
      }
      break;
    case "fixed":
      if (!Number.isFinite(product.discountValue) || product.discountValue < 0) {
        errors.push({
          field: "discountValue",
          message: "مبلغ تخفیف باید عددی معتبر و غیرمنفی باشد.",
        });
      }
      break;
    default: {
      const exhaustiveCheck: never = product.discountType;
      return exhaustiveCheck;
    }
  }

  return createValidationResult(errors);
}

export function validateOutputUnitCompatibility(
  products: ProductInput[],
  outputUnit: OutputUnit
): ValidationResult {
  const outputFamily = getOutputUnitFamily(outputUnit);
  const hasIncompatibleProduct = products.some((product) => {
    if (!isValidName(product) || !isValidAmount(product)) {
      return false;
    }

    const productFamily = getProductFamily(product);

    return productFamily !== null && productFamily !== outputFamily;
  });

  if (!hasIncompatibleProduct) {
    return createValidationResult([]);
  }

  return createValidationResult([
    {
      field: "outputUnit",
      message: COMPATIBILITY_ERROR_MESSAGE,
    },
  ]);
}

export function getProductFamilySummary(products: ProductInput[]): {
  hasMass: boolean;
  hasVolume: boolean;
  family: UnitFamily | "mixed" | "empty";
} {
  if (products.length === 0) {
    return {
      hasMass: false,
      hasVolume: false,
      family: "empty",
    };
  }

  const productFamilies = products
    .map((product) => getProductFamily(product))
    .filter((family): family is UnitFamily => family !== null);

  if (productFamilies.length === 0) {
    return {
      hasMass: false,
      hasVolume: false,
      family: "empty",
    };
  }

  const hasMass = productFamilies.includes("mass");
  const hasVolume = productFamilies.includes("volume");

  if (hasMass && hasVolume) {
    return {
      hasMass,
      hasVolume,
      family: "mixed",
    };
  }

  return {
    hasMass,
    hasVolume,
    family: hasMass ? "mass" : "volume",
  };
}

export function validateComparisonInput(
  products: ProductInput[],
  outputUnit: OutputUnit
): ValidationResult {
  const errors: ValidationError[] = [];

  if (products.length === 0) {
    errors.push({
      field: "products",
      message: "حداقل یک محصول باید وارد شود.",
    });
  }

  for (const product of products) {
    const productValidation = validateProductInput(product);

    errors.push(
      ...productValidation.errors.map((error) => ({
        ...error,
        field: `products.${product.id}.${error.field}`,
      }))
    );
  }

  errors.push(...validateOutputUnitCompatibility(products, outputUnit).errors);

  return createValidationResult(errors);
}
