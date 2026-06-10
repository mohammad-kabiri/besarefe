"use client";

import { FormEvent, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";

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

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

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
  const products = useComparisonStore((state) => state.products);
  const editingProductId = useComparisonStore(
    (state) => state.editingProductId
  );
  const editingProduct = useMemo(
    () =>
      editingProductId === null
        ? null
        : products.find((product) => product.id === editingProductId) ?? null,
    [products, editingProductId]
  );
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
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 space-y-2">
        <h2 id="product-form-title" className="text-lg font-bold text-slate-950">
          {isEditing ? "ویرایش محصول" : "افزودن محصول"}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          اطلاعات محصول را وارد کنید. عددها می‌توانند فارسی، عربی یا انگلیسی
          باشند.
        </p>
        {isEditing ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium leading-6 text-amber-800">
            در حال ویرایش محصول انتخاب‌شده هستید.
          </p>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block" htmlFor="product-name">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              نام محصول
            </span>
            <input
              className={inputClassName}
              id="product-name"
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="مثلاً رب گوجه"
              type="text"
              value={values.name}
            />
          </label>

          <label className="block" htmlFor="product-brand">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              برند
            </span>
            <input
              className={inputClassName}
              id="product-brand"
              onChange={(event) => updateField("brand", event.target.value)}
              placeholder="اختیاری"
              type="text"
              value={values.brand}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <label className="block" htmlFor="product-amount">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              وزن یا حجم
            </span>
            <NumericFormat
              allowNegative={false}
              allowedDecimalSeparators={[".", "٫"]}
              aria-describedby="product-amount-help"
              className={inputClassName}
              decimalSeparator="."
              id="product-amount"
              inputMode="decimal"
              onValueChange={(numberValues) =>
                updateField("amount", numberValues.value)
              }
              placeholder="مثلاً 800 یا 1.5"
              thousandSeparator=","
              value={values.amount}
            />
            <span
              className="mt-1 block text-xs leading-5 text-slate-500"
              id="product-amount-help"
            >
              مثلاً ۸۰۰ گرم یا ۱.۵ لیتر
            </span>
          </label>

          <label className="block" htmlFor="product-unit">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              واحد
            </span>
            <select
              className={inputClassName}
              id="product-unit"
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

        <label className="block" htmlFor="product-price">
          <span className="mb-1 block text-sm font-medium text-slate-800">
            قیمت اصلی به تومان
          </span>
          <NumericFormat
            allowNegative={false}
            aria-describedby="product-price-help"
            className={inputClassName}
            decimalScale={0}
            id="product-price"
            inputMode="numeric"
            onValueChange={(numberValues) =>
              updateField("originalPrice", numberValues.value)
            }
            placeholder="مثلاً 125,000"
            thousandSeparator=","
            value={values.originalPrice}
          />
          <span
            className="mt-1 block text-xs leading-5 text-slate-500"
            id="product-price-help"
          >
            قیمت را به تومان وارد کنید.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block" htmlFor="discount-type">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              نوع تخفیف
            </span>
            <select
              className={inputClassName}
              id="discount-type"
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
            <label className="block" htmlFor="discount-value">
              <span className="mb-1 block text-sm font-medium text-slate-800">
                مقدار تخفیف
              </span>
              <NumericFormat
                allowNegative={false}
                allowedDecimalSeparators={[".", "٫"]}
                aria-describedby="discount-value-help"
                className={inputClassName}
                decimalScale={values.discountType === "percent" ? undefined : 0}
                decimalSeparator="."
                id="discount-value"
                inputMode={
                  values.discountType === "percent" ? "decimal" : "numeric"
                }
                onValueChange={(numberValues) =>
                  updateField("discountValue", numberValues.value)
                }
                placeholder={values.discountType === "percent" ? "15" : "25,000"}
                suffix={values.discountType === "percent" ? "%" : undefined}
                thousandSeparator=","
                value={values.discountValue}
              />
              <span
                className="mt-1 block text-xs leading-5 text-slate-500"
                id="discount-value-help"
              >
                {values.discountType === "percent"
                  ? "درصد تخفیف بین ۰ تا ۱۰۰ باشد."
                  : "مبلغ تخفیف به تومان است."}
              </span>
            </label>
          ) : null}
        </div>

        {errors.length > 0 ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-3 py-3 text-sm leading-6 text-red-700"
            role="alert"
          >
            <p className="mb-1 font-bold">لطفاً این موارد را بررسی کنید:</p>
            <ul className="list-inside list-disc space-y-1">
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
            className="min-h-12 w-full rounded-xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:w-auto"
            type="submit"
          >
            {isEditing ? "ذخیره تغییرات" : "افزودن محصول"}
          </button>

          {isEditing ? (
            <button
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-auto"
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
