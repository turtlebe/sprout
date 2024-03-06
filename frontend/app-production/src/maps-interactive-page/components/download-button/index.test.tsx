import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockFarmDefLine,
  mockFarmDefMachine,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mockMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { exportToCSV } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime, Settings } from 'luxon';
import React from 'react';

import { dataTestIdsDownloadButton as dataTestIds, DownloadButton } from '.';

jest.mock('@plentyag/core/src/utils/export-to-csv');
const mockExportToCSV = exportToCSV as jest.Mock;

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter');
const mockUseQueryParameter = useQueryParameter as jest.MockedFunction<typeof useQueryParameter>;

describe('DownloadButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  function renderDownloadButton(downLoadProps: DownloadButton) {
    const mockSelectedDate = DateTime.fromSQL('2020-12-14');
    const mockParameters = {
      ...mockDefaultQueryParameters,
      selectedDate: mockSelectedDate,
      selectedCrops: ['WHC'],
      ageCohortDate: DEFAULT_AGE_COHORT_DATE,
    };
    mockUseQueryParameter.mockReturnValue({
      parameters: mockParameters,
      setParameters: jest.fn(),
      resetParameters: jest.fn(),
      resetAllParameters: jest.fn(),
    });
    return render(<DownloadButton {...downLoadProps} />);
  }

  it('renders the download button', () => {
    const { queryByTestId } = renderDownloadButton({
      mapsState: mockMapsState,
      isLoadingMachines: false,
      line: mockFarmDefLine,
    });

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  it('disables the download button when loading machines data or linePath or machines is not provided', () => {
    const { queryByTestId, rerender } = renderDownloadButton({
      mapsState: mockMapsState,
      isLoadingMachines: true,
      line: mockFarmDefLine,
    });
    expect(queryByTestId(dataTestIds.root)).toBeDisabled();

    rerender(<DownloadButton mapsState={mockMapsState} isLoadingMachines={false} machines={[mockFarmDefMachine]} />);
    expect(queryByTestId(dataTestIds.root)).toBeDisabled();

    rerender(<DownloadButton mapsState={mockMapsState} isLoadingMachines={false} line={mockFarmDefLine} />);
    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
  });

  it('downloads csv when button is clicked', () => {
    const { queryByTestId } = renderDownloadButton({
      mapsState: mockMapsState,
      machines: [mockFarmDefMachine],
      isLoadingMachines: false,
      line: mockFarmDefLine,
    });

    expect(mockExportToCSV).not.toHaveBeenCalled();

    const downloadButton = queryByTestId(dataTestIds.root);
    expect(downloadButton).toBeInTheDocument();

    downloadButton.click();

    // filters are set (in renderDownloadButton) to only select resource with
    // crop "WHC", so only one row is expected.
    expect(mockExportToCSV).toHaveBeenCalledWith(
      'sites_SSF2_areas_VerticalGrow_lines_GrowRoom_maps_data_2020-12-14T00:00:00.000-08:00.csv',
      [
        [
          'Site',
          'Area',
          'Line',
          'Machine',
          'Container Location',
          'Container Serial',
          'Container Type',
          'Material Lot Name',
          'Crop',
          'Container Labels',
          'Material Labels',
          'Container Status',
          'Load Date',
          'Age Cohort',
          'Is conflict?',
        ],
        [
          'SSF2',
          'Propagation',
          'PropagationRack',
          '',
          '',
          'P900-0008046A:CWS6-7POV-3H',
          'TABLE',
          'a728cf39-d2c1-4034-9570-aa8128292e9f',
          'BAC,WHC',
          '',
          '',
          'IN_USE',
          '',
          '',
          'FALSE',
        ],
      ]
    );
  });
});
