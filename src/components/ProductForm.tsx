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
  "h-13 min-h-13 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base font-medium text-[var(--color-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-teal-100";

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

function FormGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3 rounded-3xl bg-slate-50/70 p-3 sm:p-4">
      <legend className="px-1 text-sm font-black text-[var(--color-primary-strong)]">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldLabel({
  htmlFor,
  label,
  helper,
  children,
}: {
  htmlFor: string;
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1 block text-sm font-bold text-slate-800">
        {label}
      </span>
      {children}
      {helper ? (
        <span className="mt-1 block text-xs leading-6 text-[var(--color-muted)]">
          {helper}
        </span>
      ) : null}
    </label>
  );
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
      className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5 space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-sm font-black text-[var(--color-primary-strong)]">
            ۱
          </span>
          <h2
            id="product-form-title"
            className="text-xl font-black text-[var(--color-text)]"
          >
            {isEditing ? "ویرایش محصول" : "افزودن محصول"}
          </h2>
        </div>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          اطلاعات روی بسته‌بندی یا برچسب قیمت را وارد کنید.
        </p>
        {isEditing ? (
          <p className="rounded-2xl border border-amber-200 bg-[var(--color-warning-soft)] px-3 py-2 text-sm font-bold leading-6 text-amber-800">
            در حال ویرایش محصول انتخاب‌شده هستید.
          </p>
        ) : null}
      </div>

      {errors.length > 0 ? (
        <div
          className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700"
          role="alert"
        >
          <p className="mb-1 font-black">این موارد را بررسی کنید:</p>
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={`${error.field}-${error.message}`}>{error.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormGroup title="مشخصات محصول">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldLabel htmlFor="product-name" label="نام محصول">
              <input
                className={inputClassName}
                id="product-name"
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="رب گوجه"
                type="text"
                value={values.name}
              />
            </FieldLabel>

            <FieldLabel htmlFor="product-brand" label="برند، اختیاری">
              <input
                className={inputClassName}
                id="product-brand"
                onChange={(event) => updateField("brand", event.target.value)}
                placeholder="تبرک"
                type="text"
                value={values.brand}
              />
            </FieldLabel>
          </div>
        </FormGroup>

        <FormGroup title="وزن یا حجم">
          <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
            <FieldLabel
              helper="مثلاً ۸۰۰ گرم یا ۱.۵ لیتر"
              htmlFor="product-amount"
              label="مقدار"
            >
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
                placeholder="۸۰۰"
                thousandSeparator=","
                value={values.amount}
              />
            </FieldLabel>

            <FieldLabel htmlFor="product-unit" label="واحد">
              <select
                className={inputClassName}
                id="product-unit"
                onChange={(event) =>
                  updateField("unit", event.target.value as Unit)
                }
                value={values.unit}
              >
                {INPUT_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </div>
        </FormGroup>

        <FormGroup title="قیمت">
          <FieldLabel
            helper="قیمت اصلی را به تومان وارد کنید."
            htmlFor="product-price"
            label="قیمت اصلی"
          >
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
              placeholder="۱۲۵٬۰۰۰"
              thousandSeparator=","
              value={values.originalPrice}
            />
          </FieldLabel>
        </FormGroup>

        <FormGroup title="تخفیف">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldLabel htmlFor="discount-type" label="نوع تخفیف">
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
            </FieldLabel>

            {values.discountType !== "none" ? (
              <FieldLabel
                helper={
                  values.discountType === "percent"
                    ? "درصد تخفیف باید بین ۰ تا ۱۰۰ باشد."
                    : "مبلغ تخفیف را به تومان وارد کنید."
                }
                htmlFor="discount-value"
                label="مقدار تخفیف"
              >
                <NumericFormat
                  allowNegative={false}
                  allowedDecimalSeparators={[".", "٫"]}
                  aria-describedby="discount-value-help"
                  className={inputClassName}
                  decimalScale={
                    values.discountType === "percent" ? undefined : 0
                  }
                  decimalSeparator="."
                  id="discount-value"
                  inputMode={
                    values.discountType === "percent" ? "decimal" : "numeric"
                  }
                  onValueChange={(numberValues) =>
                    updateField("discountValue", numberValues.value)
                  }
                  placeholder={
                    values.discountType === "percent" ? "۱۵" : "۲۵٬۰۰۰"
                  }
                  suffix={values.discountType === "percent" ? "%" : undefined}
                  thousandSeparator=","
                  value={values.discountValue}
                />
              </FieldLabel>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-[var(--color-muted)]">
                اگر محصول تخفیف ندارد، همین گزینه را نگه دارید.
              </div>
            )}
          </div>
        </FormGroup>

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <button
            className="min-h-13 w-full rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-[var(--color-primary-strong)] focus:outline-none focus:ring-4 focus:ring-teal-100 sm:w-auto"
            type="submit"
          >
            {isEditing ? "ذخیره تغییرات" : "افزودن به مقایسه"}
          </button>

          {isEditing ? (
            <button
              className="min-h-13 w-full rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto"
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
