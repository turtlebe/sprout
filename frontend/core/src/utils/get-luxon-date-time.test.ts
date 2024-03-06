import { DateTime, Settings } from 'luxon';

import { DateTimeFormat, getLuxonDateTime } from './get-luxon-date-time';

describe('getLuxonDateTime', () => {
  beforeAll(() => {
    Settings.defaultLocale = 'en';
    Settings.defaultZone = 'America/Los_Angeles';
    jest.useFakeTimers();
    jest.setSystemTime(DateTime.local(2009, 1, 1, 0, 0, 0).toJSDate());
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
    jest.useRealTimers();
  });

  describe('parsing falsy value', () => {
    it('returns DateTime instance with now if value is undefined (like MomentJS)', () => {
      // ACT
      const dateTime = getLuxonDateTime();

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-01-01T00:00:00.000-08:00');
    });

    it('returns DateTime instance with invalid date if value is null or false (like MomentJS)', () => {
      // ACT
      const dateTime1 = getLuxonDateTime(null);
      const dateTime2 = getLuxonDateTime(false as any);

      // ASSERT
      expect(dateTime1.toString()).toEqual('Invalid DateTime');
      expect(dateTime2.toString()).toEqual('Invalid DateTime');
    });

    it('returns DateTime instance with invalid date if value is not parsable', () => {
      // ACT
      const dateTime = getLuxonDateTime('invalid input');

      // ASSERT
      expect(dateTime.toString()).toEqual('Invalid DateTime');
    });

    it('returns DateTime instance with invalid date if Epoch seconds are too early beyond JS limits', () => {
      // ACT
      const dateTime = getLuxonDateTime(-9999999999999);

      // ASSERT
      expect(dateTime.toString()).toEqual('Invalid DateTime');
    });
  });

  describe('parsing DateTime object', () => {
    it('returns DateTime instance from another DateTime object', () => {
      // ACT
      const dateTime = getLuxonDateTime(DateTime.utc(2009, 4, 19, 17, 36).toLocal());

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-19T10:36:00.000-07:00');
    });

    it('returns DateTime instance from another DateTime object (ignore passed in format)', () => {
      // ACT
      const dateTime = getLuxonDateTime(DateTime.utc(2009, 4, 19, 17, 36).toLocal(), 'hh:ss a');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-19T10:36:00.000-07:00');
    });
  });

  describe('parsing native Date object', () => {
    it('returns DateTime instance from native Date object', () => {
      // ACT
      const dateTime = getLuxonDateTime(new Date('2009-04-16T02:06:13.000-07:00'));

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T02:06:13.000-07:00');
    });

    it('returns DateTime instance from native Date object (ignore passed in format)', () => {
      // ACT
      const dateTime = getLuxonDateTime(new Date('2009-04-16T02:06:13.000-07:00'), 'hh:ss a');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T02:06:13.000-07:00');
    });
  });

  describe('parsing Epoch seconds', () => {
    it('returns DateTime instance from Epoch seconds', () => {
      // ACT
      const dateTime = getLuxonDateTime(1239872773.123);

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T02:06:13.123-07:00');
    });
  });

  describe('parsing string with date format', () => {
    it('returns DateTime instance from string with specified format', () => {
      // ACT
      const dateTime = getLuxonDateTime('April 16, 2009', 'MMMM dd, yyyy');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T00:00:00.000-07:00');
    });

    it('returns DateTime instance from string with specified format and locale options', () => {
      // ACT
      const dateTime = getLuxonDateTime('16 avril 2009', 'dd MMMM yyyy', { locale: 'fr' });

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T00:00:00.000-07:00');
    });
  });

  describe('string date variety of common formats', () => {
    it('returns DateTime instance from SQL date format', () => {
      // ACT
      const dateTime = getLuxonDateTime('2009-04-16');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T00:00:00.000-07:00');
    });

    it('returns DateTime instance from ISO format', () => {
      // ACT
      const dateTime = getLuxonDateTime('2009-04-16T02:06:13.000-07:00');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T02:06:13.000-07:00');
    });

    it('returns DateTime instance from SQL with timezone format', () => {
      // ACT
      const dateTime = getLuxonDateTime('2009-04-16 15:06:00.000 -0700');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T15:06:00.000-07:00');
    });

    it('returns DateTime instance from SQL with time (AG Grid) format', () => {
      // ACT
      const dateTime = getLuxonDateTime('2009-04-16 00:00:00');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T00:00:00.000-07:00');
    });

    it('returns DateTime instance from local US date format', () => {
      // ACT
      const dateTime = getLuxonDateTime('04/16/2009');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T00:00:00.000-07:00');
    });

    it('returns DateTime instance from local US date with time format', () => {
      // ACT
      const dateTime = getLuxonDateTime('04/16/2009 12:30 PM');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T12:30:00.000-07:00');
    });

    it('returns DateTime instance from local US date with time with seconds format', () => {
      // ACT
      const dateTime = getLuxonDateTime('04/16/2009 12:30:33 PM');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T12:30:33.000-07:00');
    });

    it('returns DateTime instance from local date format', () => {
      // ACT
      const dateTime = getLuxonDateTime('4/16/2009');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T00:00:00.000-07:00');
    });

    it('returns DateTime instance from local date with time format', () => {
      // ACT
      const dateTime = getLuxonDateTime('4/16/2009 1:30 PM');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T13:30:00.000-07:00');
    });

    it('returns DateTime instance from local date with time seconds format', () => {
      // ACT
      const dateTime = getLuxonDateTime('4/16/2009 1:30:33 PM');

      // ASSERT
      expect(dateTime.toString()).toEqual('2009-04-16T13:30:33.000-07:00');
    });
  });

  describe('test output format', () => {
    it('returns correct in default date time format', () => {
      // ACT
      const result = getLuxonDateTime('2018-05-01T13:44:48.708709Z').toFormat(DateTimeFormat.DEFAULT);

      // ASSERT
      expect(result).toEqual('5/1/2018 6:44 AM');
    });

    it('returns correct in default date time with seconds format', () => {
      // ACT
      const result = getLuxonDateTime('2018-05-01T13:44:48.708709Z').toFormat(DateTimeFormat.DEFAULT_WITH_SECONDS);

      // ASSERT
      expect(result).toEqual('5/1/2018 6:44:48 AM');
    });

    it('returns correct in default date only format', () => {
      // ACT
      const result = getLuxonDateTime('2018-05-01T13:44:48.708709Z').toFormat(DateTimeFormat.DATE_ONLY);

      // ASSERT
      expect(result).toEqual('5/1/2018');
    });

    it('returns correct in default time only format', () => {
      // ACT
      const result = getLuxonDateTime('2018-05-01T13:44:48.708709Z').toFormat(DateTimeFormat.TIME_ONLY);

      // ASSERT
      expect(result).toEqual('6:44 AM');
    });

    it('returns correct in default time with seconds format', () => {
      // ACT
      const result = getLuxonDateTime('2018-05-01T13:44:48.708709Z').toFormat(DateTimeFormat.TIME_WITH_SECONDS);

      // ASSERT
      expect(result).toEqual('6:44:48 AM');
    });

    it('returns correct in default localized verbose format', () => {
      // ARRANGE
      const date = new Date('2018-05-01T13:44:48.708709Z');

      // ACT
      const result = getLuxonDateTime(date).toFormat(DateTimeFormat.VERBOSE_DEFAULT);

      // ASSERT -- default standard for "en" locale
      expect(result).toEqual(
        new Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
          timeZone: 'America/Los_Angeles',
        }).format(date)
      );
    });
  });
});
