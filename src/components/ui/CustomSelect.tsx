"use client";

import {
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type CustomSelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
};

type CustomSelectProps<T extends string = string> = {
  id?: string;
  label?: string;
  value: T;
  options: CustomSelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

function getNextEnabledIndex<T extends string>(
  options: CustomSelectOption<T>[],
  startIndex: number,
  direction: 1 | -1
) {
  if (options.length === 0) {
    return -1;
  }

  for (let offset = 0; offset < options.length; offset += 1) {
    const index =
      (startIndex + direction * offset + options.length) % options.length;

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

export default function CustomSelect<T extends string = string>({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "انتخاب کنید",
  helperText,
  error,
  disabled = false,
  className = "",
}: CustomSelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const initialActiveIndex = useMemo(
    () =>
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : getNextEnabledIndex(options, 0, 1),
    [options, selectedIndex]
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function openListbox() {
    if (disabled) {
      return;
    }

    setActiveIndex(initialActiveIndex);
    setOpen(true);
  }

  function selectOption(option: CustomSelectOption<T>) {
    if (option.disabled) {
      return;
    }

    onChange(option.value);
    setOpen(false);
  }

  function moveActiveIndex(direction: 1 | -1) {
    const startIndex = activeIndex >= 0 ? activeIndex + direction : 0;
    const nextIndex = getNextEnabledIndex(options, startIndex, direction);

    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (open && activeIndex >= 0) {
          const activeOption = options[activeIndex];

          if (activeOption) {
            selectOption(activeOption);
          }
        } else {
          openListbox();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          moveActiveIndex(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          moveActiveIndex(-1);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label ? (
        <label
          className="mb-1 block text-sm font-bold text-slate-800"
          htmlFor={selectId}
        >
          {label}
        </label>
      ) : null}

      <button
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-h-13 w-full items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-right text-base font-medium text-[var(--color-text)] outline-none transition hover:border-teal-200 hover:bg-teal-50/40 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        disabled={disabled}
        id={selectId}
        onClick={() => (open ? setOpen(false) : openListbox())}
        onKeyDown={handleTriggerKeyDown}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedOption?.label ?? placeholder}
        </span>
        <span
          aria-hidden="true"
          className={`text-sm font-black text-[var(--color-primary-strong)] transition ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white p-1.5 text-right shadow-xl shadow-slate-900/10"
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;

            return (
              <button
                aria-selected={selected}
                className={`flex min-h-12 w-full items-start gap-3 rounded-xl px-3 py-2.5 text-right transition ${
                  selected
                    ? "bg-teal-50 text-[var(--color-primary-strong)]"
                    : "bg-white text-slate-700"
                } ${
                  active && !option.disabled ? "ring-2 ring-teal-100" : ""
                } ${
                  option.disabled
                    ? "cursor-not-allowed text-slate-400 opacity-60"
                    : "hover:bg-teal-50"
                }`}
                disabled={option.disabled}
                key={option.value}
                onClick={() => selectOption(option)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                tabIndex={-1}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-4 text-center text-sm font-black ${
                    selected
                      ? "text-[var(--color-primary)]"
                      : "text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-6">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs leading-5 text-[var(--color-muted)]">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {helperText ? (
        <p
          className="mt-1 text-xs leading-6 text-[var(--color-muted)]"
          id={helperId}
        >
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p className="mt-1 text-xs font-bold leading-6 text-rose-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
