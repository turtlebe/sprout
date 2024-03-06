import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { buildMetricForPhqa } from '../../utils/build-metric-for-phqa';

import { dataTestIdsMetricStatus as dataTestIds, MetricStatus } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

describe('MetricStatus', () => {
  const mockUsername = 'bishopthesprinkler';
  const mockObservationName = 'test';

  function renderMetricStatus(props?: MetricStatus) {
    return render(
      <MemoryRouter>
        <MetricStatus {...props} />
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    mockUsePostRequest.mockReturnValue({
      makeRequest: jest.fn(),
    });

    mockCurrentUser({
      username: mockUsername,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('not synced', () => {
    it('renders a "not synced" button if no metric is provided', () => {
      // ACT
      const { queryByTestId } = renderMetricStatus({
        observationName: mockObservationName,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.createMetricLink)).toBeInTheDocument();
    });

    it('should call to create a metric on click, show success, and fire callback onCreateMetric', async () => {
      // ARRANGE
      const mockOnCreateMetric = jest.fn();
      const mockMakeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
      mockUsePostRequest.mockReturnValue({
        makeRequest: mockMakeRequest,
      });
      const mockMetric = buildMetricForPhqa(mockUsername, mockObservationName);
      const { queryByTestId } = renderMetricStatus({
        observationName: mockObservationName,
        onCreateMetric: mockOnCreateMetric,
      });

      // ACT
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.createMetricLink)));

      // ASSERT
      expect(mockMakeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockMetric,
        })
      );
      expect(mockOnCreateMetric).toHaveBeenCalled();
      expect(successSnackbar).toHaveBeenCalledWith('Created Metric with success');
    });
  });

  describe('synced', () => {
    it('renders "synced" link if metric is provided', () => {
      // ARRANGE
      const mockMetric = buildMetricForPhqa(mockUsername, mockObservationName);

      // ACT
      const { queryByTestId } = renderMetricStatus({
        observationName: mockObservationName,
        metric: {
          ...mockMetric,
          id: '123-abc',
        } as any,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.metricLink)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.passIcon)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.metricLink)).toHaveAttribute('href', '/environment-v2/metrics/123-abc');
    });
  });
});
