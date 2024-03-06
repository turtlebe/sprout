import { mockMetrics, mockUsersMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest, usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { PaginatedList } from '@plentyag/core/src/types';
import { UsersMetric } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { EVS_URLS } from '../../utils';

import { ButtonFavoriteMetric, dataTestIdsButtonFavoriteMetric as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');

const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const makeDeleteRequest = jest.fn();
const makePostRequest = jest.fn();
const revalidate = jest.fn();

const [metric] = mockMetrics;
const activeClass = 'MuiIconButton-colorSecondary';

interface MockRequests {
  data?: PaginatedList<UsersMetric>;
  isValidating?: boolean;
}

function mockRequests({ data = undefined, isValidating = false }: MockRequests) {
  makeDeleteRequest.mockImplementation(({ onSuccess }) => onSuccess());
  makePostRequest.mockImplementation(({ onSuccess }) => onSuccess());
  mockUseDeleteRequest.mockReturnValue({ makeRequest: makeDeleteRequest });
  mockUsePostRequest.mockReturnValue({ makeRequest: makePostRequest });
  mockUseSwrAxios.mockReturnValue({ data, isValidating, revalidate });
}

mockCurrentUser();

describe('ButtonFavoriteMetric', () => {
  beforeEach(() => {
    mockUseDeleteRequest.mockRestore();
    mockUsePostRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    makeDeleteRequest.mockRestore();
    makePostRequest.mockRestore();
    revalidate.mockRestore();
  });

  it('renders as disabled when no Metric is passed', () => {
    mockRequests({});

    const { queryByTestId } = render(<ButtonFavoriteMetric metric={undefined} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
  });

  it('renders as disabled while loading if the Metric is marked as favorite', () => {
    mockRequests({ isValidating: true });
    const { queryByTestId } = render(<ButtonFavoriteMetric metric={metric} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: expect.stringContaining(EVS_URLS.usersMetrics.listUrl()) });
  });

  it('renders as not marked as favorite', () => {
    mockRequests({ data: buildPaginatedResponse([]) });

    const { queryByTestId } = render(<ButtonFavoriteMetric metric={metric} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
  });

  it('renders as marked as favorite', () => {
    mockRequests({ data: buildPaginatedResponse(mockUsersMetrics) });

    const { queryByTestId } = render(<ButtonFavoriteMetric metric={metric} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);
  });

  it('marks the Metric as favorite', async () => {
    mockRequests({ data: buildPaginatedResponse([]) });

    const { queryByTestId } = render(<ButtonFavoriteMetric metric={metric} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);

    mockRequests({ data: buildPaginatedResponse(mockUsersMetrics) });

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);
    expect(makePostRequest).toHaveBeenCalledWith(
      expect.objectContaining({ data: { metricId: metric.id, username: 'olittle' } })
    );
    expect(makeDeleteRequest).not.toHaveBeenCalled();
    expect(revalidate).toHaveBeenCalled();
  });

  it('unmarks the Metric as favorite', async () => {
    mockRequests({ data: buildPaginatedResponse(mockUsersMetrics) });

    const { queryByTestId } = render(<ButtonFavoriteMetric metric={metric} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);

    mockRequests({ data: buildPaginatedResponse([]) });

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
    expect(makePostRequest).not.toHaveBeenCalled();
    expect(makeDeleteRequest).toHaveBeenCalled();
    expect(revalidate).toHaveBeenCalled();
  });

  it('marks as a non favorite when usersMetrics does not contain the metric and `disableFetching` is passed', () => {
    mockRequests({});
    const { queryByTestId } = render(<ButtonFavoriteMetric metric={metric} disableFetching />, {
      wrapper: GlobalSnackbar,
    });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('marks as a favorite when usersMetrics contains the metric and `disableFetching` is passed', () => {
    mockRequests({});
    const usersMetrics = { ...mockUsersMetrics[0], metric: metric, metricId: metric.id };
    const { queryByTestId } = render(
      <ButtonFavoriteMetric metric={metric} usersMetrics={[usersMetrics]} disableFetching />,
      {
        wrapper: GlobalSnackbar,
      }
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });
});
