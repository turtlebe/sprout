import { DateTime } from 'luxon';

import { getDiffInDays } from '.';

describe('getDiffInDays', () => {
  it('generates 0 days for same time', () => {
    const now = DateTime.now();
    expect(getDiffInDays(now, now)).toBe(0);
  });

  it('generates 0 days when diff is less than one day', () => {
    const time1 = DateTime.fromISO('2022-05-15T00:00');
    const time2 = DateTime.fromISO('2022-05-14T00:01');
    expect(getDiffInDays(time1, time2)).toBe(0);

    expect(
      getDiffInDays(
        DateTime.fromISO('2022-09-09T07:00:00.000Z'),
        DateTime.fromJSDate(new Date('2022-09-09T10:29:12.814970Z')).startOf('day')
      )
    ).toBe(0);
  });

  it('generates 1 day difference', () => {
    const now = DateTime.now();
    const yesterday = now.minus({ days: 1 });
    expect(getDiffInDays(now, yesterday)).toBe(1);

    const yesterdayMinusOneHour = now.minus({ days: 1, hours: 1 });
    expect(getDiffInDays(now, yesterdayMinusOneHour)).toBe(1);
  });

  it('generates -1 day difference', () => {
    const now = DateTime.now();
    const tomorrow = now.plus({ days: 1 });
    expect(getDiffInDays(now, tomorrow)).toBe(-1);
  });

  it('calculates proper number of days across dst time changes', () => {
    // note: Sun, Mar 13, 2022 2:00 AM EST is the time when clocks are turned forward 1 hour to Sun, Mar 13, 2022 3:00 AM EDT
    const time1 = DateTime.fromObject(
      { year: 2022, month: 3, day: 14, hour: 0, minute: 0 },
      { zone: 'America/New_York' }
    );
    const time2 = DateTime.fromObject(
      { year: 2022, month: 3, day: 12, hour: 0, minute: 0 },
      { zone: 'America/New_York' }
    );
    expect(getDiffInDays(time1, time2)).toBe(2);

    // note: Sun, Nov 6, 2022 2:00 AM EDT is the time when clocks are turned backward 1 hour to Sun, Nov 6, 2022 1:00 AM EST
    const time3 = DateTime.fromObject(
      { year: 2022, month: 11, day: 7, hour: 0, minute: 0 },
      { zone: 'America/New_York' }
    );
    const time4 = DateTime.fromObject(
      { year: 2022, month: 11, day: 5, hour: 0, minute: 0 },
      { zone: 'America/New_York' }
    );
    expect(getDiffInDays(time3, time4)).toBe(2);
  });
});
