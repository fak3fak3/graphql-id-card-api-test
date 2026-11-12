/** Fields of an experience that are derived from its dates. */
export interface ExperiencePeriod {
  /** True while the job has no end date. */
  isCurrent: boolean;
  /** Human-readable period, e.g. "декабрь 2022 — декабрь 2024". */
  period: string;
  /** Length in months, counting both the first and the last month. */
  durationMonths: number;
}

// Written out instead of taken from Intl, so the result does not depend on the
// ICU data of the Node build (Intl also appends "г." to the year in Russian).
const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
] as const;

const PRESENT = 'настоящее время';

function formatMonth(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function monthIndex(date: Date): number {
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

/**
 * Business rules of a work period. Dates are stored as calendar dates in UTC
 * and are precise to a month. `now` is a parameter, which keeps the function
 * pure and its results reproducible in tests.
 */
export function describePeriod(
  startDate: Date,
  endDate: Date | null,
  now: Date,
): ExperiencePeriod {
  const isCurrent = endDate === null;
  const lastMonth = endDate ?? now;

  return {
    isCurrent,
    period: `${formatMonth(startDate)} — ${
      isCurrent ? PRESENT : formatMonth(lastMonth)
    }`,
    // A job that has not started yet has no duration rather than a negative one.
    durationMonths: Math.max(
      0,
      monthIndex(lastMonth) - monthIndex(startDate) + 1,
    ),
  };
}
