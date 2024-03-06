import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

mockConsoleError();
mockGlobalSnackbar();

import { useMetricErrorHandler } from '.';

const metricAlreadyExistsError = 'This Metric already exists. See Metric#12345';
const genericError = 'error';

describe('useMetricErrorHandler', () => {
  beforeEach(() => {
    errorSnackbar.mockReset();
  });

  it('renders a link in the snackbar', () => {
    const { result } = renderHook(() => useMetricErrorHandler());

    result.current.handleError({ error: metricAlreadyExistsError });

    expect(errorSnackbar).toHaveBeenCalledWith({ message: expect.any(Object) });
  });

  it('executes logs 400 errors in the snackbar', () => {
    const { result } = renderHook(() => useMetricErrorHandler());

    result.current.handleError({ error: genericError, status: 400 });

    expect(errorSnackbar).toHaveBeenCalledWith({ message: genericError });
  });

  it('logs the default error', () => {
    const { result } = renderHook(() => useMetricErrorHandler());

    result.current.handleError({ error: genericError, status: 500 });

    expect(errorSnackbar).toHaveBeenCalled();
  });
});
