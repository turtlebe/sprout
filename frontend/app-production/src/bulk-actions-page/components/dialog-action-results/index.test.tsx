import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { ActionStatus, ContainerActionResult, SerialStatus } from '../../types';

import { dataTestIdsDialogActionResults as dataTestIds, DialogActionResults } from '.';

const mockSerials = ['P900-0008480B:SZSY-EVI3-6R', 'P900-0008046A:LK65-LM28-5Y'];

const mockContainersAllSuccess: ContainerActionResult[] = [
  {
    isSelected: true,
    serial: mockSerials[0],
    serialStatus: SerialStatus.valid,
    resourceState: undefined,
    status: ActionStatus.success,
  },
  {
    isSelected: true,
    serial: mockSerials[1],
    serialStatus: SerialStatus.valid,
    resourceState: undefined,
    status: ActionStatus.success,
  },
];

const mockContainersOneFail: ContainerActionResult[] = [
  {
    isSelected: true,
    serial: mockSerials[0],
    serialStatus: SerialStatus.valid,
    resourceState: undefined,
    status: ActionStatus.success,
  },
  {
    isSelected: true,
    serial: mockSerials[1],
    serialStatus: SerialStatus.valid,
    resourceState: undefined,
    status: ActionStatus.fail,
  },
];

const mockAddLabelOperation: ProdActions.Operation = {
  path: 'sites/SSF2/interfaces/Traceability/methods/AddLabelGeneral',
  prefilledArgs: {
    id: {
      isDisabled: true,
      value: mockSerials,
    },
  },
  bulkFieldName: 'id',
};

jest.mock('@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download');
const mockHandleAgGridCsvDownload = handleAgGridCsvDownload as jest.Mock;

jest.mock('@plentyag/brand-ui/src/components/base-ag-grid-table');
const mockBaseAgGridClientSideTable = BaseAgGridClientSideTable as jest.Mock;
mockBaseAgGridClientSideTable.mockImplementation(() => {
  return <div>mock results table</div>;
});

const mockClose = jest.fn();

describe('DialogActionResults', () => {
  beforeEach(() => {
    mockHandleAgGridCsvDownload.mockClear();
    mockClose.mockClear();
  });

  it('closes results page when close button is clicked', () => {
    const { queryByTestId } = render(
      <DialogActionResults action={mockAddLabelOperation} containers={mockContainersAllSuccess} onClose={mockClose} />
    );

    expect(mockClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.close).click();

    expect(mockClose).toHaveBeenCalled();
  });

  it('displays number of successful bulk actions', () => {
    const { queryByTestId } = render(
      <DialogActionResults action={mockAddLabelOperation} containers={mockContainersAllSuccess} onClose={mockClose} />
    );

    expect(queryByTestId(dataTestIds.numSuccesses)).toHaveTextContent('Number of successes: 2');
  });

  it('displays number of failed bulk actions', () => {
    const { queryByTestId } = render(
      <DialogActionResults action={mockAddLabelOperation} containers={mockContainersOneFail} onClose={mockClose} />
    );

    expect(queryByTestId(dataTestIds.numFailures)).toHaveTextContent('Number of failures: 1');
  });

  it('calls "handleAgGridCsvDownload" when "Download All" button is clicked', () => {
    const { queryByTestId } = render(
      <DialogActionResults action={mockAddLabelOperation} containers={mockContainersAllSuccess} onClose={mockClose} />
    );

    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.downloadAll).click();

    expect(mockHandleAgGridCsvDownload).toHaveBeenCalled();
  });

  it('calls "handleAgGridCsvDownload" when "Download Failed" button is clicked', () => {
    const { queryByTestId } = render(
      <DialogActionResults action={mockAddLabelOperation} containers={mockContainersOneFail} onClose={mockClose} />
    );

    expect(queryByTestId(dataTestIds.downloadFailures)).not.toBeDisabled();

    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.downloadFailures).click();

    expect(mockHandleAgGridCsvDownload).toHaveBeenCalled();
  });

  it('disables "Download Failed" button when there are no failed actions', () => {
    const { queryByTestId } = render(
      <DialogActionResults action={mockAddLabelOperation} containers={mockContainersAllSuccess} onClose={mockClose} />
    );

    expect(queryByTestId(dataTestIds.downloadFailures)).toBeDisabled();
  });
});
