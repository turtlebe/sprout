import { useFetchAndConvertScheduleWithDefinition } from '@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-schedule-with-definition';
import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { copyAlertRule } from '@plentyag/app-environment/src/metric-page/utils';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { AlertRule } from '@plentyag/core/src/types/environment';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';

import { useMetricApi } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-schedule-with-definition');
jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockAxiosRequest = axiosRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseFetchAndConvertScheduleWithDefinition = useFetchAndConvertScheduleWithDefinition as jest.Mock;

const metric = { ...mockMetrics[0], alertRules: mockAlertRules };
const metricId = metric.id;

mockCurrentUser();
mockGlobalSnackbar();
mockUseFetchMeasurementTypes();

describe('useGetAlertRules', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockUseFetchAndConvertScheduleWithDefinition.mockRestore();
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule: undefined,
      scheduleRequest: { data: undefined, isValidating: false },
      scheduleDefinition: undefined,
      isLoading: false,
      revalidate: jest.fn(),
    });
  });

  it('returns no data', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true, error: undefined });

    const { result } = renderHook(() => useMetricApi({ metricId }));

    expect(result.current.metric).toBeUndefined();
    expect(result.current.alertRules).toHaveLength(0);
    expect(result.current.request.isValidating).toBe(true);
    expect(result.current.isUpdating).toBe(false);

    expect(mockAxiosRequest).not.toHaveBeenCalled();
  });

  it('updates alertRules then resets them', async () => {
    mockUseSwrAxios.mockReturnValue({ data: metric, isValidating: false, error: undefined });

    const { result, rerender } = renderHook(() => useMetricApi({ metricId }));

    expect(result.current.metric).toEqual(metric);
    expect(result.current.alertRules).toEqual(mockAlertRules);
    expect(result.current.request.isValidating).toBe(false);
    expect(result.current.isUpdating).toBe(false);

    const newAlertRule: AlertRule = {
      ...mockAlertRules[0],
      startsAt: moment(mockAlertRules[0].startsAt).add(1, 'day').format(),
    };

    await actAndAwaitForHook(() => result.current.updateAlertRule(newAlertRule));

    rerender();

    expect(result.current.alertRules).toEqual([{ ...newAlertRule, updatedBy: 'olittle' }, ...mockAlertRules.slice(1)]);

    await actAndAwaitForHook(() => result.current.resetAlertRules());

    rerender();

    expect(result.current.alertRules).toEqual(mockAlertRules);
    expect(mockAxiosRequest).not.toHaveBeenCalled();
  });

  it('persists alertRules to the backend', async () => {
    const revalidate = jest.fn();
    mockUseSwrAxios.mockReturnValue({ data: metric, isValidating: false, error: undefined, revalidate });

    const { result, rerender } = renderHook(() => useMetricApi({ metricId }));

    expect(result.current.isUpdating).toBe(false);

    const newAlertRule: AlertRule = {
      ...mockAlertRules[0],
      startsAt: moment(mockAlertRules[0].startsAt).add(1, 'day').format(),
    };
    const updatedAlertRules = [{ ...newAlertRule, updatedBy: 'olittle' }, ...mockAlertRules.slice(1)];
    const onSuccess = jest.fn();

    await actAndAwaitForHook(() => result.current.updateAlertRule(newAlertRule));

    rerender();

    expect(result.current.alertRules).toEqual(updatedAlertRules);
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    mockUseSwrAxios.mockReturnValue({
      data: { ...metric, alertRules: updatedAlertRules },
      isValidating: false,
      error: undefined,
    });

    await actAndAwaitForHook(() => result.current.persistAlertRules({ onSuccess }));

    expect(onSuccess).toHaveBeenCalled();
    expect(successSnackbar).toHaveBeenCalled();
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: 'PUT',
        url: EVS_URLS.alertRules.updateUrl(updatedAlertRules[0]),
        data: updatedAlertRules[0],
      })
    );

    await actAndAwaitForHook(() => result.current.resetAlertRules());

    rerender();

    expect(result.current.alertRules).toEqual(updatedAlertRules);
  });

  it('sorts rules when persisting the alertRules to the backend', async () => {
    const revalidate = jest.fn();
    mockUseSwrAxios.mockReturnValue({ data: metric, isValidating: false, error: undefined, revalidate });

    const { result, rerender } = renderHook(() => useMetricApi({ metricId }));

    expect(result.current.isUpdating).toBe(false);

    const newAlertRule: AlertRule = {
      ...mockAlertRules[0],
      rules: [mockAlertRules[0].rules[1], mockAlertRules[0].rules[0]],
    };
    const updatedAlertRules = [{ ...newAlertRule, updatedBy: 'olittle' }, ...mockAlertRules.slice(1)];
    const updatedAndSortedAlertRules = updatedAlertRules.map(alertRule => copyAlertRule({ alertRule }));
    const onSuccess = jest.fn();

    await actAndAwaitForHook(() => result.current.updateAlertRule(newAlertRule));

    rerender();

    expect(result.current.alertRules).toEqual(updatedAlertRules);

    mockUseSwrAxios.mockReturnValue({
      data: { ...metric, alertRules: updatedAndSortedAlertRules },
      isValidating: false,
      error: undefined,
    });

    await actAndAwaitForHook(() => result.current.persistAlertRules({ onSuccess }));

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: 'PUT',
        url: EVS_URLS.alertRules.updateUrl(updatedAndSortedAlertRules[0]),
        data: updatedAndSortedAlertRules[0],
      })
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(successSnackbar).toHaveBeenCalled();

    await actAndAwaitForHook(() => result.current.resetAlertRules());

    rerender();

    expect(result.current.alertRules).toEqual(updatedAndSortedAlertRules);
  });

  it('updates and persists alertRules to the backend', async () => {
    const revalidate = jest.fn();
    mockUseSwrAxios.mockReturnValue({ data: metric, isValidating: false, error: undefined, revalidate });

    const { result, rerender } = renderHook(() => useMetricApi({ metricId }));

    expect(result.current.isUpdating).toBe(false);

    const newAlertRule: AlertRule = {
      ...mockAlertRules[0],
      startsAt: moment(mockAlertRules[0].startsAt).add(1, 'day').format(),
    };
    const newAlertRules = [newAlertRule, ...mockAlertRules.slice(1)];
    const updatedAlertRules = newAlertRules.map(alertRule => ({ ...alertRule, updatedBy: 'olittle' }));
    const onSuccess = jest.fn();
    mockUseSwrAxios.mockReturnValue({
      data: { ...metric, alertRules: updatedAlertRules },
      isValidating: false,
      error: undefined,
    });

    await actAndAwaitForHook(() => result.current.updateAndPersistAlertRules(newAlertRules, { onSuccess }));

    rerender();

    expect(result.current.alertRules).toEqual(updatedAlertRules);

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: 'PUT',
        url: EVS_URLS.alertRules.updateUrl(updatedAlertRules[0]),
        data: updatedAlertRules[0],
      })
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(revalidate).toHaveBeenCalled();
    expect(successSnackbar).toHaveBeenCalled();

    await actAndAwaitForHook(() => result.current.resetAlertRules());

    rerender();

    expect(result.current.alertRules).toEqual(updatedAlertRules);
  });
});
