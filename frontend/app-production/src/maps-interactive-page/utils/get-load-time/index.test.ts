import { DateTime } from 'luxon';

import { getLoadTime } from '.';

describe('getLoadTime', () => {
  describe('based on now', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
      jest.resetAllMocks();
    });

    function mockNow(isoNow: string) {
      jest.setSystemTime(new Date(isoNow));
    }

    it('displays time in days, hours, minutes', () => {
      mockNow('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-01T18:57:00.000Z').toISOString())).toBe('2d 1h 3m');

      // 2 years ago
      mockNow('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2020-06-03T20:00:00.000Z').toISOString())).toBe('730d 0h 0m');
    });

    it('displays only hours and minutes when time less than 24 hours', () => {
      mockNow('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-03T00:01:00.000Z').toISOString())).toBe('19h 59m');
    });

    it('displays proper time when exactly 1 day: 1d 0h 0m', () => {
      mockNow('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-02T20:00:00.000Z').toISOString())).toBe('1d 0h 0m');
    });

    it('displays proper time when exactly 1 hour ago: 1h 0m', () => {
      mockNow('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-03T19:00:00.000Z').toISOString())).toBe('1h 0m');
    });

    it('displays only minutes when time is less than hour', () => {
      mockNow('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-03T19:30:00.000Z').toISOString())).toBe('30m');
    });
  });

  describe('given base date', () => {
    it('diplays time in days, hours, minutes', () => {
      const baseDate = DateTime.fromISO('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-01T18:57:00.000Z').toISOString(), baseDate)).toBe('2d 1h 3m');

      // 2 years ago
      expect(getLoadTime(new Date('2020-06-03T20:00:00.000Z').toISOString(), baseDate)).toBe('730d 0h 0m');
    });

    it('displays only hours and minutes when time less than 24 hours', () => {
      const baseDate = DateTime.fromISO('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-03T00:01:00.000Z').toISOString(), baseDate)).toBe('19h 59m');
    });

    it('displays proper time when exactly 1 day: 1d 0h 0m', () => {
      const baseDate = DateTime.fromISO('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-02T20:00:00.000Z').toISOString(), baseDate)).toBe('1d 0h 0m');
    });

    it('displays proper time when exactly 1 hour ago: 1h 0m', () => {
      const baseDate = DateTime.fromISO('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-03T19:00:00.000Z').toISOString(), baseDate)).toBe('1h 0m');
    });

    it('displays only minutes when time is less than hour', () => {
      const baseDate = DateTime.fromISO('2022-06-03T20:00:00.000Z');
      expect(getLoadTime(new Date('2022-06-03T19:30:00.000Z').toISOString(), baseDate)).toBe('30m');
    });
  });
});
