import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';

import {
  convert24HourTimeToAMPMFormat,
  convertDateToTimeString,
  convertTimeToDate,
  validateDate,
  validateTime,
} from './date-utils';

const invalidDate = new Date('0/0/0');
const validDate = new Date('5/1/2000');
const validTime = DateTime.fromFormat('11:00 PM', DateTimeFormat.US_TIME_ONLY);
const invalidTime = new Date('99:99');

describe('validateDate', () => {
  it('valid date should give no error', () => {
    expect(validateDate(validDate)).toBeUndefined();
    expect(validateDate(new Date('2000-1-2'))).toBeUndefined();
    expect(validateDate(new Date('2099-12-31'))).toBeUndefined();
  });

  it('invalid date should return error', () => {
    expect(validateDate(invalidDate)).toBeTruthy();
  });

  it('date less than min allowed gives error', () => {
    expect(validateDate(new Date('1999-1-1'))).toBeTruthy();
  });

  it('date greater than max allowed gives error', () => {
    expect(validateDate(new Date('2100-1-1'))).toBeTruthy();
  });

  describe('validateTime', () => {
    it('returns no error when having a valid time', () => {
      expect(validateTime(validTime.toJSDate())).toBeUndefined();
    });

    it('returrns error when having a invalid time', () => {
      expect(validateTime(invalidTime)).toEqual('Invalid Time');
    });

    it('converts successfully a date to 24 hour format', () => {
      expect(convertDateToTimeString(validTime.toJSDate())).toEqual('23:00');
    });

    describe('convert24HourTimeToAMPMFormat', () => {
      it('converts successfully 24 hour to AM PM format', () => {
        expect(convert24HourTimeToAMPMFormat('22:00')).toEqual('10:00 PM');
      });

      it('converts successfully 24 hour with seconds to AM PM format', () => {
        expect(convert24HourTimeToAMPMFormat('21:00:03')).toEqual('09:00 PM');
      });

      it('returns original value if it cannot convert', () => {
        expect(convert24HourTimeToAMPMFormat('21:00:03.24323')).toEqual('21:00:03.24323');
      });
    });

    describe('convertTimeToDate', () => {
      it('converts successfully AM PM format to Date', () => {
        const date: Date = convertTimeToDate('22:35');
        expect(date.getHours()).toEqual(22);
        expect(date.getMinutes()).toEqual(35);
      });

      it('converts successfully AM PM format with seconds to Date', () => {
        const date: Date = convertTimeToDate('22:35:23');
        expect(date.getHours()).toEqual(22);
        expect(date.getMinutes()).toEqual(35);
        expect(date.getSeconds()).toEqual(23);
      });

      it('returns invalid date if cannot convert', () => {
        const date = convertTimeToDate('10:35:23 PM');
        expect(isNaN(date as unknown as number)).toBeTruthy();
      });
    });
  });
});
