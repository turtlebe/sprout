import moment from 'moment-timezone';

import { buildAlertRule } from '../test-helpers';

import { isDstInInterval } from './is-dst-in-interval';

const alertRule = buildAlertRule({ startsAt: '2019-05-20T15:17:00-06:00' });

describe('isDstInInterval', () => {
  describe('within a timezone that does not observe DST', () => {
    beforeAll(() => {
      moment.tz.setDefault('America/Phoenix');
    });

    afterAll(() => {
      moment.tz.setDefault();
    });

    it('handles Spring transition', () => {
      expect(isDstInInterval(alertRule, new Date('2023-03-11T15:16:59-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-03-11T15:17:00-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-03-12T15:16:59-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-03-12T15:17:00-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
    });

    it('handles Fall transition', () => {
      expect(isDstInInterval(alertRule, new Date('2023-11-04T15:16:59-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-11-04T15:17:00-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-11-05T15:16:59-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-11-05T15:17:00-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
    });
  });

  describe('within a timezone that does not observe DST', () => {
    beforeAll(() => {
      moment.tz.setDefault('America/Denver');
    });

    afterAll(() => {
      moment.tz.setDefault();
    });

    it('handles Spring transition', () => {
      expect(isDstInInterval(alertRule, new Date('2023-03-11T15:16:59-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-03-11T15:17:00-06:00'))).toEqual({
        isDstTransition: true,
        isSpringTransition: true,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-03-12T15:16:59-06:00'))).toEqual({
        isDstTransition: true,
        isSpringTransition: true,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-03-12T15:17:00-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
    });

    it('handles Fall transition', () => {
      expect(isDstInInterval(alertRule, new Date('2023-11-04T15:16:59-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
      expect(isDstInInterval(alertRule, new Date('2023-11-04T15:17:00-06:00'))).toEqual({
        isDstTransition: true,
        isSpringTransition: false,
        isFallTransition: true,
      });
      expect(isDstInInterval(alertRule, new Date('2023-11-05T15:16:59-06:00'))).toEqual({
        isDstTransition: true,
        isSpringTransition: false,
        isFallTransition: true,
      });
      expect(isDstInInterval(alertRule, new Date('2023-11-05T15:17:00-06:00'))).toEqual({
        isDstTransition: false,
        isSpringTransition: false,
        isFallTransition: false,
      });
    });

    it('calculates if the previous interval has DST', () => {
      expect(isDstInInterval(alertRule, new Date('2023-11-05T15:17:00-06:00'), -1)).toEqual({
        isDstTransition: true,
        isSpringTransition: false,
        isFallTransition: true,
      });
    });

    it('calculates if the next interval has DST', () => {
      expect(isDstInInterval(alertRule, new Date('2023-11-03T15:17:00-06:00'), 1)).toEqual({
        isDstTransition: true,
        isSpringTransition: false,
        isFallTransition: true,
      });
    });
  });
});
