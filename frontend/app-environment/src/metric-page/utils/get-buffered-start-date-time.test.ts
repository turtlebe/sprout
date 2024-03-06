import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { getPreviousIntervalStart } from '@plentyag/app-environment/src/common/utils/get-previous-interval-start';
import moment from 'moment';

import { getBufferedStartDateTime } from './get-buffered-start-date-time';

jest.mock('@plentyag/app-environment/src/common/utils/get-previous-interval-start');

const mockGetPreviousIntervalStart = getPreviousIntervalStart as jest.Mock;

const [defaultMetric] = mockMetrics;
const startDateTime = moment('2022-01-05T00:00:00Z').toDate();

describe('getBufferedStartDateTime', () => {
  beforeEach(() => {
    mockGetPreviousIntervalStart.mockRestore();
  });
  it('returns the startDateTime when the metric is undefined', () => {
    expect(getBufferedStartDateTime(undefined, startDateTime)).toEqual(startDateTime);
  });

  it('returns the startDateTime when the metric has null alert rules', () => {
    const metric = { ...defaultMetric, alertRules: null };

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(startDateTime);
  });

  it('returns the startDateTime when the metric has empty alert rules', () => {
    const metric = { ...defaultMetric, alertRules: [] };

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(startDateTime);
  });

  it('returns the startDateTime when the metric has alert rules with no repeatInterval', () => {
    const metric = {
      ...defaultMetric,
      alertRules: mockAlertRules.map(alertRule => ({ ...alertRule, repeatInterval: undefined })),
    };

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(startDateTime);
  });

  it('returns the startDateTime when the startDateTime is before the previousIntervalStart', () => {
    const metric = { ...defaultMetric, alertRules: mockAlertRules };
    mockGetPreviousIntervalStart.mockReturnValue(moment('2022-01-06T00:00:00Z'));

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(startDateTime);
  });

  it('returns the previousIntervalStart when the startDateTime is after the previousIntervalStart', () => {
    const metric = { ...defaultMetric, alertRules: mockAlertRules };
    const previousIntervalStart = moment('2022-01-04T00:00:00Z');
    mockGetPreviousIntervalStart.mockReturnValue(previousIntervalStart);

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(previousIntervalStart.toDate());
  });

  it('uses the AlertRule that has longest interval and the earliest startsAt (using the time but ignoring the date)', () => {
    const [alertRule] = mockAlertRules;
    const alertRule1 = { ...alertRule };
    const alertRule2 = {
      ...alertRule,
      startsAt: '2022-01-01T10:00:00Z',
      repeatInterval: 172800,
    };
    const alertRule3 = {
      ...alertRule,
      startsAt: '2022-05-01T03:00:00Z',
      repeatInterval: 172800,
    };
    const alertRules = [alertRule1, alertRule2, alertRule3];
    const metric = { ...defaultMetric, alertRules };
    const previousIntervalStart = moment('2022-01-04T00:00:00Z');
    mockGetPreviousIntervalStart.mockReturnValue(previousIntervalStart);

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(previousIntervalStart.toDate());
    expect(mockGetPreviousIntervalStart).toHaveBeenCalledWith(alertRule3);
  });

  it('uses the AlertRule that has longest interval and the earliest startsAt (using the time but ignoring the date)', () => {
    const [alertRule] = mockAlertRules;
    const alertRule1 = { ...alertRule };
    const alertRule2 = {
      ...alertRule,
      startsAt: '2022-01-01T03:00:00Z',
      repeatInterval: 172800,
    };
    const alertRule3 = {
      ...alertRule,
      startsAt: '2022-05-01T10:00:00Z',
      repeatInterval: 172800,
    };
    const alertRules = [alertRule1, alertRule2, alertRule3];
    const metric = { ...defaultMetric, alertRules };
    const previousIntervalStart = moment('2022-01-04T00:00:00Z');
    mockGetPreviousIntervalStart.mockReturnValue(previousIntervalStart);

    expect(getBufferedStartDateTime(metric, startDateTime)).toEqual(previousIntervalStart.toDate());
    expect(mockGetPreviousIntervalStart).toHaveBeenCalledWith(alertRule2);
  });
});
