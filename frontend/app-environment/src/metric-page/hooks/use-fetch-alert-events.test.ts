import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useFetchAlertEvents } from '.';

const [metric] = mockMetrics;
const metricWithAlertRules = { ...metric, alertRules: mockAlertRules };
const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-02-01T00:00:00Z');

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useFetchAlertEvents', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('does not call useSwrAxios when the metric has no alert rules', () => {
    renderHook(() => useFetchAlertEvents({ metric, startDateTime, endDateTime }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('calls useSwrAxios when the metric has alert rules', () => {
    renderHook(() => useFetchAlertEvents({ metric: metricWithAlertRules, startDateTime, endDateTime }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          metricWithAlertRules.alertRules.map(alertRule => `alertRuleIds[]=${alertRule.id}`).join('&')
        ),
      })
    );
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(`startDateTime=${encodeURIComponent(startDateTime.toISOString())}`),
      })
    );
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(`endDateTime=${encodeURIComponent(endDateTime.toISOString())}`),
      })
    );
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.not.stringContaining('activeOnly=true'),
      })
    );
  });

  it('fetches active alerts regardless of time', () => {
    renderHook(() => useFetchAlertEvents({ metric: metricWithAlertRules, active: true }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          metricWithAlertRules.alertRules.map(alertRule => `alertRuleIds[]=${alertRule.id}`).join('&')
        ),
      })
    );
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('activeOnly=true'),
      })
    );
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.not.stringContaining('startDateTime'),
      })
    );
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.not.stringContaining('endDateTime'),
      })
    );
  });
});
