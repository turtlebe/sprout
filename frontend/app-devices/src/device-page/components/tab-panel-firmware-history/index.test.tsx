import { dataTestIdsTableRowLoadingPlaceholder } from '@plentyag/app-devices/src/common/components';
import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { FirmwareHistory } from '@plentyag/app-devices/src/common/types';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import { Settings } from 'luxon';
import React from 'react';

import { dataTestIdsTabPanelFirmwareHistory as dataTestIds, TabPanelFirmwareHistory } from '.';

const [device] = mockDevices;
const firmwareHistory: FirmwareHistory[] = [
  {
    deviceId: 'a2836c7b-ea6d-4d16-9a34-7eb07f535c25',
    firmwareVersion: '1.0.1-5',
    binaryType: 'APP',
    createdAt: '2021-04-16T05:47:16.338822Z',
  },
  {
    deviceId: 'a2836c7b-ea6d-4d16-9a34-7eb07f535c25',
    firmwareVersion: '1.1.0',
    binaryType: 'BOOTLOADER',
    createdAt: '2021-04-13T18:35:06.205251Z',
  },
];

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('TabPanelFirmwareHistory', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders with an empty state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = render(<TabPanelFirmwareHistory device={device} />);

    expect(queryByTestId(dataTestIdsTableRowLoadingPlaceholder.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(firmwareHistory[0]))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(firmwareHistory[1]))).not.toBeInTheDocument();
  });

  it('renders the firmware history of the device', () => {
    mockUseSwrAxios.mockReturnValue({ data: firmwareHistory, isValidating: false });

    const { queryByTestId } = render(<TabPanelFirmwareHistory device={device} />);
    const [history1, history2] = firmwareHistory;

    expect(queryByTestId(dataTestIdsTableRowLoadingPlaceholder.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(history1))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(history1))).toHaveTextContent(history1.binaryType);
    expect(queryByTestId(dataTestIds.tableRow(history1))).toHaveTextContent(history1.firmwareVersion);
    expect(queryByTestId(dataTestIds.tableRow(history1))).toHaveTextContent('4/15/2021 10:47:16 PM');
    expect(queryByTestId(dataTestIds.tableRow(history2))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(history2))).toHaveTextContent(history2.binaryType);
    expect(queryByTestId(dataTestIds.tableRow(history2))).toHaveTextContent(history2.firmwareVersion);
    expect(queryByTestId(dataTestIds.tableRow(history2))).toHaveTextContent('4/13/2021 11:35:06 AM');
  });
});
