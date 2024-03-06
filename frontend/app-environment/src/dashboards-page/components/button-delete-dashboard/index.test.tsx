import { mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonDeleteDashboard, dataTestIdsButtonDeleteDashboard as dataTestIds } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;
const onSuccess = jest.fn();

mockGlobalSnackbar();

describe('ButtonDeleteDashboard', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    onSuccess.mockRestore();
    successSnackbar.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { container } = render(<ButtonDeleteDashboard dashboards={[]} onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a disabled button', () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(<ButtonDeleteDashboard dashboards={[]} onSuccess={jest.fn()} />);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();
  });

  it('deletes dashboards', async () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(<ButtonDeleteDashboard dashboards={mockDashboards} onSuccess={onSuccess} />);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'DELETE',
      url: EVS_URLS.dashboards.deleteUrl(mockDashboards[0]),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
      method: 'DELETE',
      url: EVS_URLS.dashboards.deleteUrl(mockDashboards[1]),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });
});
