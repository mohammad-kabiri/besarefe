"use client";

import { FormEvent, useState } from "react";

import type { DiscountType, ProductInput, Unit } from "@/types/product";

import {
  DEFAULT_DISCOUNT_TYPE,
  DEFAULT_INPUT_UNIT,
  DISCOUNT_TYPE_OPTIONS,
  INPUT_UNIT_OPTIONS,
} from "@/lib/constants";
import { parseLocalizedNumber } from "@/lib/numberUtils";
import { validateProductInput, type ValidationError } from "@/lib/validation";
import { useComparisonStore } from "@/store/comparisonStore";
import { selectEditingProduct } from "@/store/comparisonSelectors";

type ProductFormValues = {
  name: string;
  brand: string;
  amount: string;
  unit: Unit;
  originalPrice: string;
  discountType: DiscountType;
  discountValue: string;
};

const EMPTY_FORM_VALUES: ProductFormValues = {
  name: "",
  brand: "",
  amount: "",
  unit: DEFAULT_INPUT_UNIT,
  originalPrice: "",
  discountType: DEFAULT_DISCOUNT_TYPE,
  discountValue: "",
};

function getFormValuesFromProduct(product: ProductInput): ProductFormValues {
  return {
    name: product.name,
    brand: product.brand ?? "",
    amount: String(product.amount),
    unit: product.unit,
    originalPrice: String(product.originalPrice),
    discountType: product.discountType,
    discountValue:
      product.discountType === "none" ? "" : String(product.discountValue),
  };
}

function getProductFromForm(values: ProductFormValues): Omit<ProductInput, "id"> {
  return {
    name: values.name.trim(),
    brand: values.brand.trim() || undefined,
    amount: parseLocalizedNumber(values.amount),
    unit: values.unit,
    originalPrice: parseLocalizedNumber(values.originalPrice),
    discountType: values.discountType,
    discountValue:
      values.discountType === "none"
        ? 0
        : parseLocalizedNumber(values.discountValue),
  };
}

export default function ProductForm() {
  const editingProductId = useComparisonStore(
    (state) => state.editingProductId
  );
  const editingProduct = useComparisonStore(selectEditingProduct);
  const formKey = editingProduct?.id ?? "new-product";

  return (
    <ProductFormInner
      editingProduct={editingProduct}
      editingProductId={editingProductId}
      key={formKey}
    />
  );
}

function ProductFormInner({
  editingProduct,
  editingProductId,
}: {
  editingProduct: ProductInput | null;
  editingProductId: string | null;
}) {
  const addProduct = useComparisonStore((state) => state.addProduct);
  const updateProduct = useComparisonStore((state) => state.updateProduct);
  const setEditingProduct = useComparisonStore(
    (state) => state.setEditingProduct
  );
  const [values, setValues] = useState<ProductFormValues>(
    editingProduct ? getFormValuesFromProduct(editingProduct) : EMPTY_FORM_VALUES
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isEditing = editingProductId !== null && editingProduct !== null;

  function updateField<Key extends keyof ProductFormValues>(
    field: Key,
    value: ProductFormValues[Key]
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function resetForm() {
    setValues(EMPTY_FORM_VALUES);
    setErrors([]);
  }

  function cancelEdit() {
    setEditingProduct(null);
    resetForm();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const productData = getProductFromForm(values);
    const productForValidation: ProductInput = {
      ...productData,
      id: editingProductId ?? "draft-product",
    };
    const validation = validateProductInput(productForValidation);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (isEditing && editingProductId) {
      updateProduct(editingProductId, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    resetForm();
  }

  return (
    <section
      aria-labelledby="product-form-title"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2
            id="product-form-title"
            className="text-lg font-bold text-slate-950"
          >
            {isEditing ? "ویرایش محصول" : "افزودن محصول"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            قیمت، مقدار و تخفیف را وارد کنید تا مقایسه به‌روز شود.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              نام محصول
            </span>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="مثلا رب گوجه"
              type="text"
              value={values.name}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              برند
            </span>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => updateField("brand", event.target.value)}
              placeholder="اختیاری"
              type="text"
              value={values.brand}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              وزن یا حجم
            </span>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              inputMode="decimal"
              onChange={(event) => updateField("amount", event.target.value)}
              placeholder="مثلا ۵۰۰"
              type="text"
              value={values.amount}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              واحد
            </span>
            <select
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => updateField("unit", event.target.value as Unit)}
              value={values.unit}
            >
              {INPUT_UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-800">
            قیمت اصلی
          </span>
          <input
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            inputMode="numeric"
            onChange={(event) =>
              updateField("originalPrice", event.target.value)
            }
            placeholder="تومان"
            type="text"
            value={values.originalPrice}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              نوع تخفیف
            </span>
            <select
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) =>
                updateField("discountType", event.target.value as DiscountType)
              }
              value={values.discountType}
            >
              {DISCOUNT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {values.discountType !== "none" ? (
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-800">
                مقدار تخفیف
              </span>
              <input
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                inputMode="decimal"
                onChange={(event) =>
                  updateField("discountValue", event.target.value)
                }
                placeholder={
                  values.discountType === "percent" ? "درصد" : "تومان"
                }
                type="text"
                value={values.discountValue}
              />
            </label>
          ) : null}
        </div>

        {errors.length > 0 ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
            role="alert"
          >
            <ul className="space-y-1">
              {errors.map((error) => (
                <li key={`${error.field}-${error.message}`}>
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="min-h-12 rounded-xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            type="submit"
          >
            {isEditing ? "ذخیره تغییرات" : "افزودن محصول"}
          </button>

          {isEditing ? (
            <button
              className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
              onClick={cancelEdit}
              type="button"
            >
              لغو ویرایش
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
