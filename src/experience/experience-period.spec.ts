import { describePeriod } from './experience-period.js';

const date = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const now = date('2026-11-12');

describe('describePeriod', () => {
  it('describes a finished job', () => {
    expect(describePeriod(date('2022-12-01'), date('2024-12-01'), now)).toEqual(
      {
        isCurrent: false,
        period: 'декабрь 2022 — декабрь 2024',
        durationMonths: 25,
      },
    );
  });

  it('describes a current job up to the present day', () => {
    expect(describePeriod(date('2025-01-01'), null, now)).toEqual({
      isCurrent: true,
      period: 'январь 2025 — настоящее время',
      durationMonths: 23,
    });
  });

  it('counts a job that started and ended in the same month as one month', () => {
    expect(
      describePeriod(date('2024-05-01'), date('2024-05-01'), now)
        .durationMonths,
    ).toBe(1);
  });

  it('does not report a negative duration for a job in the future', () => {
    expect(describePeriod(date('2027-01-01'), null, now).durationMonths).toBe(
      0,
    );
  });

  it('uses UTC, so a date never shifts to the previous month', () => {
    expect(
      describePeriod(date('2025-01-01'), date('2025-03-01'), now).period,
    ).toBe('январь 2025 — март 2025');
  });
});
