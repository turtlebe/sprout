import moment from 'moment-timezone';

import { buildAlertRule } from '../test-helpers';

import { getEditModeStartDateTime } from '.';

const alertRule = buildAlertRule({ startsAt: '2019-05-20T15:17:00-06:00' });

describe('getEditModeStartDateTime', () => {
  beforeAll(() => {
    moment.tz.setDefault('America/Denver');
    jest.useFakeTimers();
  });

  afterAll(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
  });

  function getStartDateTime(time) {
    jest.setSystemTime(new Date(time));

    return getEditModeStartDateTime(alertRule).format();
  }

  it('handles Spring DST', () => {
    expect(getStartDateTime('2023-03-11T14:16:59-07:00')).toEqual('2023-03-09T14:17:00-07:00');
    expect(getStartDateTime('2023-03-11T14:17:00-07:00')).toEqual('2023-03-10T14:17:00-07:00');
    expect(getStartDateTime('2023-03-12T15:16:59-06:00')).toEqual('2023-03-12T15:17:00-06:00');
    expect(getStartDateTime('2023-03-12T15:17:00-06:00')).toEqual('2023-03-12T15:17:00-06:00');
    expect(getStartDateTime('2023-03-13T15:16:59-06:00')).toEqual('2023-03-12T15:17:00-06:00');
    expect(getStartDateTime('2023-03-13T15:17:00-06:00')).toEqual('2023-03-12T15:17:00-06:00');
    expect(getStartDateTime('2023-03-14T15:16:59-06:00')).toEqual('2023-03-12T15:17:00-06:00');
    expect(getStartDateTime('2023-03-14T15:17:00-06:00')).toEqual('2023-03-13T15:17:00-06:00');
  });

  it('handles Fall DST', () => {
    expect(getStartDateTime('2023-11-04T15:16:59-06:00')).toEqual('2023-11-02T15:17:00-06:00');
    expect(getStartDateTime('2023-11-04T15:17:00-06:00')).toEqual('2023-11-03T15:17:00-06:00');
    expect(getStartDateTime('2023-11-05T14:16:59-07:00')).toEqual('2023-11-05T14:17:00-07:00');
    expect(getStartDateTime('2023-11-05T14:17:00-07:00')).toEqual('2023-11-05T14:17:00-07:00');
    expect(getStartDateTime('2023-11-06T14:16:59-07:00')).toEqual('2023-11-05T14:17:00-07:00');
    expect(getStartDateTime('2023-11-06T14:17:00-07:00')).toEqual('2023-11-05T14:17:00-07:00');
    expect(getStartDateTime('2023-11-07T14:16:59-07:00')).toEqual('2023-11-05T14:17:00-07:00');
    expect(getStartDateTime('2023-11-07T14:17:00-07:00')).toEqual('2023-11-06T14:17:00-07:00');
  });
});
