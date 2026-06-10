const DIGIT_MAP: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

const PERSIAN_NUMBER_FORMATTER = new Intl.NumberFormat("fa-IR");

export function normalizePersianDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => DIGIT_MAP[digit] ?? digit);
}

export function stripNumberSeparators(value: string): string {
  return value.replace(/[,،\s\u00a0]/g, "");
}

export function parseLocalizedNumber(value: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return NaN;
  }

  const normalizedValue = normalizePersianDigits(trimmedValue);
  const cleanedValue = stripNumberSeparators(normalizedValue);

  if (cleanedValue === "") {
    return NaN;
  }

  const parsedValue = Number(cleanedValue);

  return Number.isFinite(parsedValue) ? parsedValue : NaN;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "۰";
  }

  return PERSIAN_NUMBER_FORMATTER.format(value);
}

export function formatToman(value: number): string {
  return `${formatNumber(value)} تومان`;
}

export function formatPercent(
  value: number,
  maximumFractionDigits = 1
): string {
  if (!Number.isFinite(value)) {
    return "۰٪";
  }

  return `${new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits,
  }).format(value)}٪`;
}
