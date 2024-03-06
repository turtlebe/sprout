import { mockDashboards, mockUsersDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest, usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { PaginatedList } from '@plentyag/core/src/types';
import { UsersDashboard } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { EVS_URLS } from '../../utils';

import { ButtonFavoriteDashboard, dataTestIdsButtonFavoriteDashboard as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');

const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const makeDeleteRequest = jest.fn();
const makePostRequest = jest.fn();
const revalidate = jest.fn();

const [dashboard] = mockDashboards;
const activeClass = 'MuiIconButton-colorSecondary';

interface MockRequests {
  data?: PaginatedList<UsersDashboard>;
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

describe('ButtonFavoriteDashboard', () => {
  beforeEach(() => {
    mockUseDeleteRequest.mockRestore();
    mockUsePostRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    makeDeleteRequest.mockRestore();
    makePostRequest.mockRestore();
    revalidate.mockRestore();
  });

  it('renders as disabled when no Dashboard is passed', () => {
    mockRequests({});

    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={undefined} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
  });

  it('renders as disabled while loading if the Dashboard is marked as favorite', () => {
    mockRequests({ isValidating: true });
    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={dashboard} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: expect.stringContaining(EVS_URLS.usersDashboards.listUrl()) });
  });

  it('renders as not marked as favorite', () => {
    mockRequests({ data: buildPaginatedResponse([]) });

    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={dashboard} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
  });

  it('renders as marked as favorite', () => {
    mockRequests({ data: buildPaginatedResponse(mockUsersDashboards) });

    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={dashboard} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);
  });

  it('marks the Dashboard as favorite', async () => {
    mockRequests({ data: buildPaginatedResponse([]) });

    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={dashboard} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);

    mockRequests({ data: buildPaginatedResponse(mockUsersDashboards) });

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);
    expect(makePostRequest).toHaveBeenCalledWith(
      expect.objectContaining({ data: { dashboardId: dashboard.id, username: 'olittle' } })
    );
    expect(makeDeleteRequest).not.toHaveBeenCalled();
    expect(revalidate).toHaveBeenCalled();
  });

  it('unmarks the Dashboard as favorite', async () => {
    mockRequests({ data: buildPaginatedResponse(mockUsersDashboards) });

    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={dashboard} />, { wrapper: GlobalSnackbar });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);

    mockRequests({ data: buildPaginatedResponse([]) });

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
    expect(makePostRequest).not.toHaveBeenCalled();
    expect(makeDeleteRequest).toHaveBeenCalled();
    expect(revalidate).toHaveBeenCalled();
  });

  it('marks as a non favorite when usersDashboards does not contain the dashboard and `disableFetching` is passed', () => {
    mockRequests({});
    const { queryByTestId } = render(<ButtonFavoriteDashboard dashboard={dashboard} disableFetching />, {
      wrapper: GlobalSnackbar,
    });

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).not.toHaveClass(activeClass);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('marks as a favorite when usersDashboards contains the dashboard and `disableFetching` is passed', () => {
    mockRequests({});
    const usersDashboards = { ...mockUsersDashboards[0], dashboard: dashboard, dashboardId: dashboard.id };
    const { queryByTestId } = render(
      <ButtonFavoriteDashboard dashboard={dashboard} usersDashboards={[usersDashboards]} disableFetching />,
      {
        wrapper: GlobalSnackbar,
      }
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveClass(activeClass);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });
});
