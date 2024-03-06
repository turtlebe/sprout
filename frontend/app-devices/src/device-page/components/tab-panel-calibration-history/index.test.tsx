import { dataTestIdsTableRowLoadingPlaceholder } from '@plentyag/app-devices/src/common/components';
import { calibrationHistory } from '@plentyag/app-devices/src/common/test-helpers/calibration-history';
import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTabPanelCalibrationHistory as dataTestIds, TabPanelCalibrationHistory } from '.';

const [device] = mockDevices;

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('TabPanelCalibrationHistory', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders with an empty state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = render(<TabPanelCalibrationHistory device={device} />);

    expect(queryByTestId(dataTestIdsTableRowLoadingPlaceholder.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(calibrationHistory[0]))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(calibrationHistory[1]))).not.toBeInTheDocument();
  });

  it('renders the calibration history of the device', () => {
    mockUseSwrAxios.mockImplementation(args => {
      if (args.url.includes('TEMPERATURE')) {
        return {
          isValidating: false,
          data: calibrationHistory.filter(d => d.type === 'TEMPERATURE'),
          error: undefined,
        };
      }
      if (args.url.includes('RELATIVE_HUMIDITY')) {
        return {
          isValidating: false,
          data: calibrationHistory.filter(d => d.type === 'RELATIVE_HUMIDITY'),
          error: undefined,
        };
      }

      return { isValidating: false, data: undefined, error: undefined };
    });

    const { queryByTestId } = render(<TabPanelCalibrationHistory device={device} />);
    const [history1, history2] = calibrationHistory;

    expect(queryByTestId(dataTestIdsTableRowLoadingPlaceholder.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(history1))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(history1))).toHaveTextContent(history1.type);
    expect(queryByTestId(dataTestIds.tableRow(history1))).toHaveTextContent(history1.calibrationFormula);
    expect(queryByTestId(dataTestIds.tableRow(history2))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(history2))).toHaveTextContent(history2.type);
    expect(queryByTestId(dataTestIds.tableRow(history2))).toHaveTextContent(history2.calibrationFormula);
  });
});
