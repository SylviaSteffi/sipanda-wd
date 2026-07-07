import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import {
  getSuratDayPickerDisabledMatchers,
  getSupportedSuratYearRange,
} from "../../utils/suratHelpers";

const MONTH_OPTIONS = [
  { value: 0, label: "Januari" },
  { value: 1, label: "Februari" },
  { value: 2, label: "Maret" },
  { value: 3, label: "April" },
  { value: 4, label: "Mei" },
  { value: 5, label: "Juni" },
  { value: 6, label: "Juli" },
  { value: 7, label: "Agustus" },
  { value: 8, label: "September" },
  { value: 9, label: "Oktober" },
  { value: 10, label: "November" },
  { value: 11, label: "Desember" },
];

function parseIsoDate(value = "") {
  if (!value) return undefined;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;

  return date;
}

function formatIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString = "") {
  const date = parseIsoDate(dateString);
  if (!date) return "";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getSafeInitialMonth({ value, initialMonth, fromYear }) {
  return (
    parseIsoDate(value) ||
    parseIsoDate(initialMonth) ||
    new Date(`${fromYear}-01-01T00:00:00`)
  );
}

function buildYearOptions(fromYear, toYear) {
  const years = [];

  for (let year = fromYear; year <= toYear; year += 1) {
    years.push(year);
  }

  return years;
}

function SelectField({ value, onChange, children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full appearance-none rounded-lg border border-black-40 bg-white px-4 pr-10 text-sm text-black-100 outline-none transition hover:border-primary-100 focus:border-primary-100"
      >
        {children}
      </select>

      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-black-80">
        ▾
      </span>
    </div>
  );
}

function SuratDatePicker({
  value,
  onChange,
  disabled = false,
  initialMonth,
  pengajuan,
}) {
  const wrapperRef = useRef(null);
  const { fromYear, toYear } = getSupportedSuratYearRange();
  const yearOptions = useMemo(
    () => buildYearOptions(fromYear, toYear),
    [fromYear, toYear],
  );
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const disabledDays = useMemo(() => getSuratDayPickerDisabledMatchers(pengajuan), [pengajuan]);

  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getSafeInitialMonth({ value, initialMonth, fromYear }),
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleClickOutside(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggleOpen = () => {
    if (disabled) return;

    if (!isOpen) {
      setVisibleMonth(
        getSafeInitialMonth({
          value,
          initialMonth,
          fromYear,
        }),
      );
    }

    setIsOpen((prev) => !prev);
  };

  const handleMonthSelectChange = (event) => {
    const nextMonth = Number(event.target.value);

    setVisibleMonth((prev) => {
      const baseDate = prev || new Date(`${fromYear}-01-01T00:00:00`);
      return new Date(baseDate.getFullYear(), nextMonth, 1);
    });
  };

  const handleYearSelectChange = (event) => {
    const nextYear = Number(event.target.value);

    setVisibleMonth((prev) => {
      const baseDate = prev || new Date(`${fromYear}-01-01T00:00:00`);
      return new Date(nextYear, baseDate.getMonth(), 1);
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={handleToggleOpen}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-lg border border-black-40 bg-white px-4 py-3 text-left text-sm text-black-100 outline-none transition hover:border-primary-100 focus:ring-1 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-black-20 disabled:text-black-80"
      >
        <span>{value ? formatDisplayDate(value) : "Pilih tanggal surat"}</span>
        <span className="ml-3 text-xs text-black-80">▾</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 z-20 mt-2 w-[440px] max-w-full rounded-xl border border-black-40 bg-white p-4 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
          <div className="mb-4 grid grid-cols-[1fr_120px] gap-3">
            <SelectField
              value={visibleMonth.getMonth()}
              onChange={handleMonthSelectChange}
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              value={visibleMonth.getFullYear()}
              onChange={handleYearSelectChange}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="rounded-lg border border-black-20 p-3">
            <DayPicker
              mode="single"
              selected={selectedDate}
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              onSelect={(date) => {
                if (!date) return;
                onChange(formatIsoDate(date));
                setIsOpen(false);
              }}
              disabled={disabledDays}
              startMonth={new Date(`${fromYear}-01-01T00:00:00`)}
              endMonth={new Date(`${toYear}-12-01T00:00:00`)}
              hideNavigation
              classNames={{
                root: "rdp-root w-full",
                months: "flex justify-center",
                month: "space-y-3 w-full",
                caption: "hidden",
                table: "w-full border-collapse",
                month_grid: "w-full border-collapse",
                head_row: "flex w-full",
                row: "mt-1 flex w-full",
                weekdays: "flex w-full",
                weekday:
                  "flex-1 text-center text-xs font-medium uppercase tracking-wide text-black-60",
                week: "mt-1 flex w-full",
                day: "flex-1 flex justify-center",
                day_button:
                  "flex h-10 w-10 items-center justify-center rounded-lg text-sm text-black-100 transition hover:bg-primary-20",
                selected:
                  "bg-primary-100 text-white hover:bg-primary-100",
                disabled:
                  "text-black-40 line-through opacity-50 cursor-not-allowed",
                today: "font-semibold text-primary-100",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SuratDatePicker;