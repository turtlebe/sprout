import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import {
  mockFarmDefContainerLocationsWithTable,
  mockFarmDefPropLevel1Machine,
  mockFarmDefTailLiftMachine,
} from '../../test-helpers/mock-farm-def-object-data';
import { mocksResourcesState } from '../../test-helpers/mock-maps-state';

import { dataTestIdsViewIrrigationButton as dataTestIds, IrrigationTableButton } from '.';

import { IrrigationTableDrawer } from './components/irrigation-table-drawer';

jest.mock('./components/irrigation-table-drawer');
const mockIrrigationTableDrawer = IrrigationTableDrawer as jest.Mock;
const mockIrrigationTableDrawerDataTestId = 'mock-irrigation-table-drawer';
mockIrrigationTableDrawer.mockImplementation(({ open }) =>
  open ? <div data-testid={mockIrrigationTableDrawerDataTestId}>mock irrigation table drawer</div> : null
);

const mockOperation: ProdResources.Operation = {
  id: '1',
  type: 'Cult Load Prop Line',
  username: 'test user',
  endDt: '2020-12-10T18:13:57.000Z',
  startDt: '2020-12-10T18:13:57.000Z',
  machine: null,
  stateIn: null,
  stateOut: null,
  materialsConsumed: null,
  materialsCreated: null,
};

const defaultMockData = {
  containerLocation: mockFarmDefPropLevel1Machine,
  resourceState: mocksResourcesState[0],
  lastLoadOperation: mockOperation,
};

describe('IrrigationTableButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows irrigation table drawer when clicked', () => {
    const { queryByTestId } = render(<IrrigationTableButton data={defaultMockData} parentWidth={400} />);

    expect(queryByTestId(mockIrrigationTableDrawerDataTestId)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.irrigationButton).click();

    expect(queryByTestId(mockIrrigationTableDrawerDataTestId)).toBeInTheDocument();
  });

  it('does not show button when lotName is not provided', () => {
    const mockDataWithOutLotName = cloneDeep(defaultMockData);
    mockDataWithOutLotName.resourceState.materialObj.lotName = null;

    const { queryByTestId } = render(<IrrigationTableButton data={mockDataWithOutLotName} parentWidth={400} />);

    expect(queryByTestId(dataTestIds.irrigationButton)).not.toBeInTheDocument();
  });

  it('does not show button for lift table', () => {
    const mockDataWithGerminationLocation = cloneDeep(defaultMockData);
    mockDataWithGerminationLocation.containerLocation = mockFarmDefTailLiftMachine.containerLocations.LiftTable;

    const { queryByTestId } = render(
      <IrrigationTableButton data={mockDataWithGerminationLocation} parentWidth={400} />
    );

    expect(queryByTestId(dataTestIds.irrigationButton)).not.toBeInTheDocument();
  });

  it('does not show button when table is in germation', () => {
    const mockDataWithGerminationLocation = cloneDeep(defaultMockData);
    mockDataWithGerminationLocation.containerLocation = mockFarmDefContainerLocationsWithTable;

    const { queryByTestId } = render(
      <IrrigationTableButton data={mockDataWithGerminationLocation} parentWidth={400} />
    );

    expect(queryByTestId(dataTestIds.irrigationButton)).not.toBeInTheDocument();
  });

  it('does not show button when resource loaded date is not provided', () => {
    const mockDataWithNoLoadedDate = cloneDeep(defaultMockData);
    delete mockDataWithNoLoadedDate.lastLoadOperation;

    const { queryByTestId } = render(<IrrigationTableButton data={mockDataWithNoLoadedDate} parentWidth={400} />);

    expect(queryByTestId(dataTestIds.irrigationButton)).not.toBeInTheDocument();
  });
});
