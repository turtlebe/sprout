import { AlertRule } from '@plentyag/core/src/types/environment';
import moment from 'moment-timezone';

import { mockAlertRules } from '../test-helpers';

import { getIntervalStart, getIntervalStartWithoutDst, getPreviousIntervalStart } from '.';

beforeEach(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getPreviousIntervalStart', () => {
  const alertRule = { ...mockAlertRules[0], startsAt: '2022-01-01T07:00:00Z' };

  function previousIntervalStart(from?: Date) {
    return getPreviousIntervalStart(alertRule, from).utc().format();
  }

  it('returns the previous interval starts when the current time is at the end of the interval', () => {
    const mockDate = jest.spyOn(Date, 'now').mockReturnValue(new Date('2022-01-05T06:00:00Z').getTime());

    expect(previousIntervalStart()).toEqual('2022-01-03T07:00:00Z');

    mockDate.mockRestore();
  });

  it('returns the previous interval starts when the current time is the same as the intervalStart', () => {
    const mockDate = jest.spyOn(Date, 'now').mockReturnValue(new Date('2022-01-05T07:00:00Z').getTime());

    expect(previousIntervalStart()).toEqual('2022-01-04T07:00:00Z');

    mockDate.mockRestore();
  });

  it('returns the previous interval starts when the current time is at the beginning of the interval', () => {
    const mockDate = jest.spyOn(Date, 'now').mockReturnValue(new Date('2022-01-05T08:00:00Z').getTime());

    expect(previousIntervalStart()).toEqual('2022-01-04T07:00:00Z');

    mockDate.mockRestore();
  });

  it('returns the previous interval relative to the `from` time passed when the current time is at the end of the interval', () => {
    expect(previousIntervalStart(new Date('2022-01-05T06:59:59Z'))).toEqual('2022-01-03T07:00:00Z');
  });

  it('returns the previous interval relative to the `from` time passed when the current time is the same as the interval', () => {
    expect(previousIntervalStart(new Date('2022-01-05T07:00:00Z'))).toEqual('2022-01-04T07:00:00Z');
  });

  it('returns the previous interval relative to the `from` time passed when the current time is at the beginning of the interval', () => {
    expect(previousIntervalStart(new Date('2022-01-05T07:00:01Z'))).toEqual('2022-01-04T07:00:00Z');
  });
});

describe('getIntervalStart', () => {
  beforeEach(() => {
    moment.tz.setDefault('America/Denver');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  function intervalStart(alertRule: AlertRule, from: string) {
    return getIntervalStart(alertRule, new Date(from), 0).utc().format();
  }

  it('returns the beginning of the current interval (without daylight saving)', () => {
    const alertRule = { ...mockAlertRules[0], startsAt: '2021-04-01T01:00:00Z' };
    // because we cannot start before the startsAt
    expect(intervalStart(alertRule, '2021-04-01T00:59:59Z')).toEqual('2021-04-01T01:00:00Z');

    expect(intervalStart(alertRule, '2021-04-02T00:59:59Z')).toEqual('2021-04-01T01:00:00Z');

    expect(intervalStart(alertRule, '2021-04-02T01:00:00Z')).toEqual('2021-04-02T01:00:00Z');
    expect(intervalStart(alertRule, '2021-04-03T00:59:59Z')).toEqual('2021-04-02T01:00:00Z');

    expect(intervalStart(alertRule, '2021-04-03T01:00:00Z')).toEqual('2021-04-03T01:00:00Z');
  });
});

describe('getIntervalStartWithoutDst', () => {
  beforeEach(() => {
    moment.tz.setDefault('America/Denver');
  });
  afterEach(() => {
    moment.tz.setDefault();
  });

  const isoDate = (date: string) => moment(date).utc().format();

  const alertRuleStartingAt = (date: string) => ({ ...mockAlertRules[0], startsAt: isoDate(date) });

  const intervalStart = (alertRule: AlertRule, from: string) =>
    getIntervalStartWithoutDst(alertRule, new Date(isoDate(from))).format();

  // in the spring, humans forward the clock +1, the code does the opposite to keep the time consistent.
  // in the fall, humans rewind the clock -1, the code does the opposite to keep the time consistent.

  describe('Spring DST transitions', () => {
    /**
     *  Spring DST -> 2023-03-12T01:59:59-07:00 + 1 seconds = 2023-03-12T03:00:00-06:00
     */
    it('returns the start of the interval during Spring DST change (startsAt during DST) - example 1', () => {
      // AR starts during DST
      const alertRule = alertRuleStartingAt('2019-05-20T15:17:00-06:00');

      expect(intervalStart(alertRule, '2023-03-11T14:16:59-07:00')).toEqual('2023-03-10T14:17:00-07:00');
      expect(intervalStart(alertRule, '2023-03-11T14:17:00-07:00')).toEqual('2023-03-10T14:17:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T01:59:59-07:00')).toEqual('2023-03-10T14:17:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T03:00:00-06:00')).toEqual('2023-03-12T15:17:00-06:00');
    });

    it('returns the start of the interval during Spring DST change (startsAt during DST) - example 2', () => {
      // AR starts during DST
      const alertRule = alertRuleStartingAt('2019-05-20T01:30:00-06:00');

      expect(intervalStart(alertRule, '2023-03-11T00:29:59-07:00')).toEqual('2023-03-10T00:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-11T00:30:00-07:00')).toEqual('2023-03-11T00:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T00:29:59-07:00')).toEqual('2023-03-11T00:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T00:30:00-07:00')).toEqual('2023-03-11T00:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T01:59:59-07:00')).toEqual('2023-03-11T00:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T03:00:00-06:00')).toEqual('2023-03-13T01:30:00-06:00');
    });

    it('returns the start of the interval during Spring DST change (startsAt before DST)', () => {
      // AR starts before DST
      const alertRule = alertRuleStartingAt('2019-02-20T01:30:00-07:00');

      expect(intervalStart(alertRule, '2023-03-11T01:29:59-07:00')).toEqual('2023-03-10T01:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-11T01:30:00-07:00')).toEqual('2023-03-11T01:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T01:29:59-07:00')).toEqual('2023-03-11T01:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T01:30:00-07:00')).toEqual('2023-03-11T01:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T01:59:59-07:00')).toEqual('2023-03-11T01:30:00-07:00');
      expect(intervalStart(alertRule, '2023-03-12T03:00:00-06:00')).toEqual('2023-03-13T02:30:00-06:00');
    });
  });

  describe('Fall DST transitions', () => {
    /**
     * Fall DSL -> 2023-11-05T01:59:59-06:00 + 1 seconds = 2023-11-05T01:00:00-07:00
     */

    it('returns the start of the interval during Fall DST change (startsAt during DST) - example 1', () => {
      // AR starts during DST
      const alertRule = alertRuleStartingAt('2019-05-20T15:17:00-06:00');

      expect(intervalStart(alertRule, '2023-11-04T15:16:59-06:00')).toEqual('2023-11-03T15:17:00-06:00');
      expect(intervalStart(alertRule, '2023-11-04T15:17:00-06:00')).toEqual('2023-11-03T15:17:00-06:00');
      expect(intervalStart(alertRule, '2023-11-05T01:59:59-06:00')).toEqual('2023-11-03T15:17:00-06:00');
      expect(intervalStart(alertRule, '2023-11-05T01:00:00-07:00')).toEqual('2023-11-05T14:17:00-07:00');
    });

    it('returns the start of the interval during Fall DST change (startsAt during DST) - example 1', () => {
      // AR starts before DST
      const alertRule = alertRuleStartingAt('2019-02-20T01:30:00-07:00');

      expect(intervalStart(alertRule, '2023-11-04T02:29:59-06:00')).toEqual('2023-11-03T02:30:00-06:00');
      expect(intervalStart(alertRule, '2023-11-04T02:30:00-06:00')).toEqual('2023-11-03T02:30:00-06:00');
      expect(intervalStart(alertRule, '2023-11-05T01:59:59-06:00')).toEqual('2023-11-03T02:30:00-06:00');
      expect(intervalStart(alertRule, '2023-11-05T01:00:00-07:00')).toEqual('2023-11-05T01:30:00-07:00');
    });
  });
});
