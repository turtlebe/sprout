import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { dataTestIdsSnackbar, GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDropdownComeFindMe as dataTestIds, DropdownComeFindMe, durations, SUCCESS_MESSAGE } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUsePostRequest = usePostRequest as jest.Mock;

const device = mockDevices[1];
const hathor = mockDevices[4];
const duration = durations[1];

describe('DropdownComeFindMe', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
  });

  it('submits a requests to executive-service', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = render(
      <GlobalSnackbar>
        <DropdownComeFindMe device={device} associatedHathor={hathor} />
      </GlobalSnackbar>,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> Show Dropdown Items
    queryByTestId(dataTestIds.root).click();

    // -> Click on Dropdown Item
    await actAndAwait(() => queryByTestId(dataTestIds.item(duration)).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({
        broadcast: false,
        farmdef_ids: [device.id],
        command: 'SPRINKLES_COME_FIND_ME',
        cfm_beats: duration.value,
      }),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent(SUCCESS_MESSAGE);
  });

  it('shows an error in the snackbar', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError({ error: 'error-message' }));
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = render(
      <GlobalSnackbar>
        <DropdownComeFindMe device={device} associatedHathor={hathor} />
      </GlobalSnackbar>,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> Show Dropdown Items
    queryByTestId(dataTestIds.root).click();

    // -> Click on Dropdown Item
    await actAndAwait(() => queryByTestId(dataTestIds.item(duration)).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({
        broadcast: false,
        farmdef_ids: [device.id],
        command: 'SPRINKLES_COME_FIND_ME',
        cfm_beats: duration.value,
      }),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent('error-message');
  });
});
