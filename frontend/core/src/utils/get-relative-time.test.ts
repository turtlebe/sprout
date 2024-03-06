import { DateTime, Settings } from 'luxon';

import { getRelativeTime, SECONDS_AFTER_TEXT, SECONDS_AGO_TEXT } from './get-relative-time';

describe('getRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(DateTime.fromSQL('2023-01-25 12:27:30', { zone: 'utc' }).toJSDate());
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  it('returns the appropriate relative time', () => {
    // ARRANGE
    const date1 = DateTime.fromSQL('2023-01-25 12:00:00', { zone: 'utc' }).toJSDate();
    const date2 = DateTime.fromSQL('2023-01-25 12:28:30', { zone: 'utc' }).toJSDate();
    const date3 = DateTime.fromSQL('2023-01-25 12:26:30', { zone: 'utc' }).toJSDate();

    // ACT
    const result1 = getRelativeTime(date1);
    const result2 = getRelativeTime(date2);
    const result3 = getRelativeTime(date3);

    // ASSERT
    expect(result1).toEqual('27 minutes ago');
    expect(result2).toEqual('in 1 minute');
    expect(result3).toEqual('1 minute ago');
  });

  it(`returns "${SECONDS_AGO_TEXT}" if time was under a minute ago`, () => {
    // ARRANGE
    const date1 = DateTime.fromSQL('2023-01-25 12:26:55', { zone: 'utc' }).toJSDate();
    const date2 = DateTime.fromSQL('2023-01-25 12:27:30', { zone: 'utc' }).toJSDate();

    // ACT
    const result1 = getRelativeTime(date1);
    const result2 = getRelativeTime(date2);

    // ASSERT
    expect(result1).toEqual(SECONDS_AGO_TEXT);
    expect(result2).toEqual(SECONDS_AGO_TEXT);
  });

  it(`returns "${SECONDS_AFTER_TEXT}" if time was under a minute later`, () => {
    // ARRANGE
    const date = DateTime.fromSQL('2023-01-25 12:28:00', { zone: 'utc' }).toJSDate();

    // ACT
    const result = getRelativeTime(date);

    // ASSERT
    expect(result).toEqual(SECONDS_AFTER_TEXT);
  });
});
