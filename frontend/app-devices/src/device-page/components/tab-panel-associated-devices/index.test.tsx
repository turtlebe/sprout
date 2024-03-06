import { mockPlacedDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { Device } from '@plentyag/app-devices/src/common/types';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { times } from 'lodash';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsTabPanelAssociatedDevices as dataTestIds, ROWS_PER_PAGE, TabPanelAssociatedDevices } from '.';

describe('TabPanelAssociatedDevices', () => {
  it('renders with a loader', () => {
    const { queryByTestId } = render(<TabPanelAssociatedDevices devices={[]} isLoading />);

    expect(queryByTestId(dataTestIds.cardLoader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tablePagination)).not.toBeInTheDocument();
  });

  it('renders with an empty state', () => {
    const { queryByTestId } = render(<TabPanelAssociatedDevices devices={[]} isLoading={false} />);

    expect(queryByTestId(dataTestIds.cardLoader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.card)).toHaveTextContent('No associated devices.');
    expect(queryByTestId(dataTestIds.tablePagination)).not.toBeInTheDocument();
  });

  it('renders with a list of devices', () => {
    const [device1, device2] = mockPlacedDevices;
    const { queryByTestId } = render(<TabPanelAssociatedDevices devices={mockPlacedDevices} isLoading={false} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(queryByTestId(dataTestIds.cardLoader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.card)).not.toHaveTextContent('No associated devices.');
    expect(queryByTestId(dataTestIds.tablePagination)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(device1))).toHaveTextContent(device1.serial);
    expect(queryByTestId(dataTestIds.tableRow(device1))).toHaveTextContent(getShortenedPath(device1.location.path));
    expect(queryByTestId(dataTestIds.tableRow(device1))).toHaveTextContent(device1.deviceTypeName);
    expect(queryByTestId(dataTestIds.tableRow(device2))).toHaveTextContent(device2.serial);
    expect(queryByTestId(dataTestIds.tableRow(device2))).toHaveTextContent(getShortenedPath(device2.location.path));
    expect(queryByTestId(dataTestIds.tableRow(device2))).toHaveTextContent(device2.deviceTypeName);
  });

  it('paginates devices when there is more than ROWS_PER_PAGE devices mapped', () => {
    const devices: Device[] = times(
      ROWS_PER_PAGE * 2,
      (i): Device => ({ ...mockPlacedDevices[0], id: `device-id:${i}`, serial: `device-serial:${i}` })
    );

    const { queryByTestId } = render(<TabPanelAssociatedDevices devices={devices} isLoading={false} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(queryByTestId(dataTestIds.cardLoader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.card)).not.toHaveTextContent('No associated devices.');
    expect(queryByTestId(dataTestIds.tablePagination)).toBeInTheDocument();
    devices.slice(0, ROWS_PER_PAGE).forEach(device => {
      expect(queryByTestId(dataTestIds.tableRow(device))).toHaveTextContent(device.serial);
    });
    devices.slice(ROWS_PER_PAGE, ROWS_PER_PAGE * 2).forEach(device => {
      expect(queryByTestId(dataTestIds.tableRow(device))).not.toBeInTheDocument();
    });
    expect.assertions(23);
  });
});
