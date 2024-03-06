import { buildAlertRule, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { LiveStatus } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';

import { useGetAlertRulesWithStatus } from '.';

const metric = {
  ...mockMetrics[0],
  alertRules: [
    buildAlertRule({ rules: [{ gte: 15, lte: 20, time: 0 }] }),
    buildAlertRule({ rules: [{ gte: 10, lte: 20, time: 0 }] }),
  ],
};
const endDateTime = moment(metric.alertRules[0].startsAt).add(1, 'second').toDate();

describe('useGetAlertRulesWithStatus', () => {
  it("omits alert rules that don't have rules", () => {
    const metric = {
      ...mockMetrics[0],
      alertRules: [buildAlertRule({ rules: [] })],
    };

    const { result } = renderHook(() =>
      useGetAlertRulesWithStatus({ metric, endDateTime, observationValue: undefined })
    );
    expect(result.current.alertRules).toEqual([]);
    expect(result.current.metricStatus).toBe(LiveStatus.noData);
  });

  it('returns with noData for each Alert Rules and the Metric', () => {
    const { result } = renderHook(() =>
      useGetAlertRulesWithStatus({ metric, endDateTime, observationValue: undefined })
    );

    expect(result.current.alertRules).toEqual([]);
    expect(result.current.metricStatus).toBe(LiveStatus.noData);
  });

  it('returns with inRange for each Alert Rules and the Metric', () => {
    const { result } = renderHook(() => useGetAlertRulesWithStatus({ metric, endDateTime, observationValue: 15 }));

    expect(result.current.alertRules[0].status).toBe(LiveStatus.inRange);
    expect(result.current.alertRules[1].status).toBe(LiveStatus.inRange);
    expect(result.current.metricStatus).toBe(LiveStatus.inRange);
  });

  it('returns with outOfRange for the first Alert Rule and the Metric', () => {
    const { result } = renderHook(() => useGetAlertRulesWithStatus({ metric, endDateTime, observationValue: 10 }));

    expect(result.current.alertRules[0].status).toBe(LiveStatus.outOfRange);
    expect(result.current.alertRules[1].status).toBe(LiveStatus.inRange);
    expect(result.current.metricStatus).toBe(LiveStatus.outOfRange);
  });

  it('returns with outOfRange when a non numerical alert triggers', () => {
    const metric = {
      ...mockMetrics[0],
      measurementType: 'BINARY_STATE',
      alertRules: [buildAlertRule({ rules: [{ time: 0, eq: '1' }] })],
    };

    const { result } = renderHook(() => useGetAlertRulesWithStatus({ metric, endDateTime, observationValue: 1 }));

    expect(result.current.alertRules[0].status).toBe(LiveStatus.outOfRange);
    expect(result.current.metricStatus).toBe(LiveStatus.outOfRange);
  });

  it('returns with in when a non numerical alert does not trigger', () => {
    const metric = {
      ...mockMetrics[0],
      measurementType: 'BINARY_STATE',
      alertRules: [buildAlertRule({ rules: [{ time: 0, eq: '0' }] })],
    };

    const { result } = renderHook(() => useGetAlertRulesWithStatus({ metric, endDateTime, observationValue: 1 }));

    expect(result.current.alertRules[0].status).toBe(LiveStatus.inRange);
    expect(result.current.metricStatus).toBe(LiveStatus.inRange);
  });
});
