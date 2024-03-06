import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonDeleteSchedule, dataTestIdsButtonDeleteSchedule as dataTestIds } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;
const onSuccess = jest.fn();

mockGlobalSnackbar();

describe('ButtonDeleteSchedule', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    onSuccess.mockRestore();
    successSnackbar.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { container } = render(<ButtonDeleteSchedule schedules={[]} onSuccess={onSuccess} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a disabled button', () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(<ButtonDeleteSchedule schedules={[]} onSuccess={onSuccess} />);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();
  });

  it('deletes a schedule', async () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(<ButtonDeleteSchedule schedules={mockSchedules} onSuccess={onSuccess} />);

    // -> Dialog is not visible
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.button)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.dialog.root)).not.toBeInTheDocument();

    // -> Click Delete
    queryByTestId(dataTestIds.button).click();

    // -> Dialog is visible
    expect(queryByTestId(dataTestIds.dialog.root)).toBeInTheDocument();

    // -> Click Confirm
    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
      method: 'DELETE',
      url: EVS_URLS.schedules.deleteUrl(mockSchedules[0]),
      headers: expect.objectContaining({ 'X-Deleted-By': 'olittle' }),
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });
});
