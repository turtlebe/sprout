import { buildAlertEvent } from '@plentyag/app-environment/src/common/test-helpers';
import { useUnpaginate } from '@plentyag/core/src/hooks';
import { AlertEventStatus } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';

import { useLoadAlertEvents } from '.';

jest.mock('@plentyag/core/src/hooks/use-unpaginate');

const mockUseUnpaginate = useUnpaginate as jest.Mock;

const notificationEventId = '1234';

describe('useLoadAlertEvents', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a loader', () => {
    const makeRequest = jest.fn();
    mockUseUnpaginate.mockReturnValue({ makeRequest, isLoading: true });

    const { result } = renderHook(() => useLoadAlertEvents({ notificationEventId }));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.alertEvents).toBe(undefined);

    expect(makeRequest).toBeCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          notificationEventIds: [notificationEventId],
          includeMetric: true,
          includeAlertRule: true,
        },
      })
    );
  });

  it('returns alert events', () => {
    const data = [buildAlertEvent({ status: AlertEventStatus.triggered, generatedAt: new Date().toISOString() })];
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(data));
    mockUseUnpaginate.mockReturnValue({ makeRequest, isLoading: false });

    const { result } = renderHook(() => useLoadAlertEvents({ notificationEventId }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.alertEvents).toEqual(data);
  });
});
