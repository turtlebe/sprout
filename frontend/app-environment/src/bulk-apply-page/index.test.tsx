import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, useRedisJsonObjectApi, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { mockMetrics } from '../common/test-helpers';
import { EVS_URLS } from '../common/utils';
import { PATHS } from '../paths';

import { BulkApplyPage, dataTestIdsBulkApplyPage as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-redis-json-object-api');

const mockUseRedisJsonObjectApi = useRedisJsonObjectApi as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const makeRequest = jest.fn();

mockGlobalSnackbar();
mockCurrentUser();
mockUseFetchMeasurementTypes();

const metrics = mockMetrics;
const metricIds = metrics.map(metric => metric.id);

function renderBulkApplyPage() {
  const history = createMemoryHistory({ initialEntries: [PATHS.bulkApplyPage('mock-id')] });

  return render(
    <Router history={history}>
      <Route path={PATHS.bulkApplyPage(':redisJsonObjectId')} component={BulkApplyPage} />
    </Router>
  );
}

describe('BulkApplyPage', () => {
  beforeEach(() => {
    mockUseRedisJsonObjectApi.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockUsePostRequest.mockRestore();
    makeRequest.mockRestore();
    errorSnackbar.mockRestore();
  });

  it('show a loader when loading the redisJsonObject', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({ redisJsonObject: undefined, isLoading: true });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderBulkApplyPage();

    expect(mockUseSwrAxios).toHaveBeenCalledWith(undefined);
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyComplete)).not.toBeInTheDocument();
  });

  it('show a loader when loading metrics', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({ redisJsonObject: { value: { metricIds } }, isLoading: false });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderBulkApplyPage();

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      data: { ids: metricIds, includeAlertRules: true },
      method: 'POST',
      url: EVS_URLS.metrics.searchUrl(),
    });
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyComplete)).not.toBeInTheDocument();
  });

  it('show an error in the snackbar', async () => {
    const error = 'error';
    makeRequest.mockImplementation(({ onError }) => onError(error));
    mockUseRedisJsonObjectApi.mockReturnValue({ redisJsonObject: { value: { metricIds } }, isLoading: false });
    mockUseSwrAxios.mockReturnValue({ data: { data: metrics }, isValidating: false });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderBulkApplyPage();

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      data: { ids: metricIds, includeAlertRules: true },
      method: 'POST',
      url: EVS_URLS.metrics.searchUrl(),
    });
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyComplete)).not.toBeInTheDocument();

    getInputByName(dataTestIds.choose.metricRadio(metrics[0])).click();
    await actAndAwait(() => queryByTestId(dataTestIds.choose.bulkApply).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { templateMetricId: metrics[0].id, otherMetricIds: [metrics[1].id], updatedBy: 'olittle' },
      })
    );
    expect(queryByTestId(dataTestIds.bulkApplyComplete)).not.toBeInTheDocument();
    expect(errorSnackbar).toHaveBeenCalledWith({ message: error });
  });

  it('applies one metric to the others', async () => {
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());
    mockUseRedisJsonObjectApi.mockReturnValue({ redisJsonObject: { value: { metricIds } }, isLoading: false });
    mockUseSwrAxios.mockReturnValue({ data: { data: metrics }, isValidating: false });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderBulkApplyPage();

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      data: { ids: metricIds, includeAlertRules: true },
      method: 'POST',
      url: EVS_URLS.metrics.searchUrl(),
    });
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyComplete)).not.toBeInTheDocument();

    getInputByName(dataTestIds.choose.metricRadio(metrics[0])).click();
    await actAndAwait(() => queryByTestId(dataTestIds.choose.bulkApply).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { templateMetricId: metrics[0].id, otherMetricIds: [metrics[1].id], updatedBy: 'olittle' },
      })
    );
    expect(queryByTestId(dataTestIds.bulkApplyComplete)).toBeInTheDocument();
    expect(errorSnackbar).not.toHaveBeenCalled();
  });
});
