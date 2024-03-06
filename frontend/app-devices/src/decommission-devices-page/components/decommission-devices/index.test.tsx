import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDecommissionDevices as dataTestIds, DecommissionDevices } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;
const onIsDecommissioning = jest.fn();
const onDecommissioned = jest.fn();

mockGlobalSnackbar();

const commissionedDevices = mockDevices.filter(device => device.location);
const decommissionedDevices = mockDevices.filter(device => !device.location);

function renderDecommissionDevices(devices) {
  return render(
    <MemoryRouter>
      <DecommissionDevices
        devices={devices}
        onIsDecommissioning={onIsDecommissioning}
        onDecommissioned={onDecommissioned}
      />
    </MemoryRouter>
  );
}

describe('DecommissionDevices', () => {
  beforeEach(() => {
    onIsDecommissioning.mockRestore();
    onDecommissioned.mockRestore();
    mockAxiosRequest.mockRestore();
    successSnackbar.mockRestore();
  });

  it('renders a table with commission devices to bulk decommission', () => {
    const { queryByTestId } = renderDecommissionDevices(commissionedDevices);

    expect(queryByTestId(dataTestIds.decommissionedTable)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.placeholder.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.placeholder.cell)).not.toBeInTheDocument();

    commissionedDevices.forEach(device => {
      expect(queryByTestId(dataTestIds.tableRow(device))).toBeInTheDocument();
    });
  });

  it('renders a table of decommission devices when there are no devices to decommission', () => {
    const { queryByTestId } = renderDecommissionDevices(decommissionedDevices);

    expect(queryByTestId(dataTestIds.placeholder.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.placeholder.cell)).toHaveTextContent(
      'All commissioned devices have been decommissioned.'
    );
    expect(queryByTestId(dataTestIds.decommissionedTable)).toBeInTheDocument();

    decommissionedDevices.forEach(device => {
      expect(queryByTestId(dataTestIds.tableRowDecommissioned(device))).toBeInTheDocument();
    });
  });

  it('decommissions devices', async () => {
    mockAxiosRequest.mockResolvedValue({ data: {} });

    const { queryByTestId } = renderDecommissionDevices(commissionedDevices);

    queryByTestId(dataTestIds.decommissionDevices).click();

    await actAndAwait(() => queryByTestId(dataTestIds.dialog.confirm).click());

    commissionedDevices.forEach((device, index) => {
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          data: { deviceId: device.id },
          method: 'POST',
          url: expect.stringContaining('device-management/decommission-device'),
        })
      );
    });

    expect(onIsDecommissioning).toHaveBeenCalledTimes(3);
    expect(onIsDecommissioning).toHaveBeenNthCalledWith(1, false);
    expect(onIsDecommissioning).toHaveBeenNthCalledWith(2, true);
    expect(onIsDecommissioning).toHaveBeenNthCalledWith(3, false);
    expect(onDecommissioned).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });
});
