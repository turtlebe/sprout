import { DateTime } from 'luxon';

import { isLoadDateInSameDayAsAgeCohortDate } from '.';

const ageCohortDateEarlyDay = DateTime.fromISO('2022-06-05T00:00:05');
const ageCohortDateEndOfDay = DateTime.fromISO('2022-06-05T23:59:00');

describe('isLoadDateInSameDayAsAgeCohortDate', () => {
  it('returns true when ageCohortDate is "all"', () => {
    expect(isLoadDateInSameDayAsAgeCohortDate('all')).toBe(true);
  });

  it('returns false when lastLoadOperation not provided or startDt not provied', () => {
    expect(isLoadDateInSameDayAsAgeCohortDate(DateTime.fromSQL('2022-06-05').toJSDate())).toBe(false);
    expect(isLoadDateInSameDayAsAgeCohortDate(DateTime.fromSQL('2022-06-05').toJSDate(), null)).toBe(false);
  });

  it('returns true when startDt is the same day', () => {
    const lastLoadOperationBeginOfDay = ageCohortDateEarlyDay.minus({ seconds: 4 }).toJSDate();
    expect(isLoadDateInSameDayAsAgeCohortDate(ageCohortDateEarlyDay.toJSDate(), lastLoadOperationBeginOfDay)).toBe(
      true
    );

    const lastLoadOperationEndOfDay = ageCohortDateEndOfDay.plus({ seconds: 59 }).toJSDate();
    expect(isLoadDateInSameDayAsAgeCohortDate(ageCohortDateEndOfDay.toJSDate(), lastLoadOperationEndOfDay)).toBe(true);
  });

  it('returns false when startDt is not the same day', () => {
    const lastLoadOperationInPreviousDay = ageCohortDateEarlyDay.minus({ seconds: 6 }).toJSDate();
    expect(isLoadDateInSameDayAsAgeCohortDate(ageCohortDateEarlyDay.toJSDate(), lastLoadOperationInPreviousDay)).toBe(
      false
    );

    const lastLoadOperationInNextDay = ageCohortDateEndOfDay.plus({ seconds: 61 }).toJSDate();
    expect(isLoadDateInSameDayAsAgeCohortDate(ageCohortDateEndOfDay.toJSDate(), lastLoadOperationInNextDay)).toBe(
      false
    );
  });
});
