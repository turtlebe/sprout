import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';

import { mockFarmDefContainerLocationsWithTable } from '../../test-helpers/mock-farm-def-object-data';
import { mockIrrigationTasks } from '../../test-helpers/mock-irrigation-tasks';
import { mocksResourcesState } from '../../test-helpers/mock-maps-state';
import { getLoadTime } from '../../utils';
import { UNOCCUPIED_SLOT } from '../../utils/text-helpers';

import { ContainerSummaryTooltip, dataTestIdsTooltip } from '.';

jest.mock('../../utils/get-load-time');
const mockGetLoadTime = getLoadTime as jest.Mock;
const mockIrrigationExecution = mockIrrigationTasks[2].executions[0];

describe('ContainerSummaryTooltip', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  async function renderContainerSummaryTooltip(props: ContainerSummaryTooltip, showTooltip = true) {
    return actAndAwaitRender(
      <ContainerSummaryTooltip
        node={showTooltip ? document.createElement('div') : undefined}
        data={props.data}
        selectedDate={props.selectedDate}
      />
    );
  }

  it('shows tooltip when node is provided', async () => {
    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: { containerLocation: mockFarmDefContainerLocations },
    });

    expect(queryByTestId(dataTestIdsTooltip.container)).toBeInTheDocument();
  });

  it('does not show tooltip when node is not provided', async () => {
    const { queryByTestId } = await renderContainerSummaryTooltip(
      {
        data: { containerLocation: mockFarmDefContainerLocations },
      },
      false
    );

    expect(queryByTestId(dataTestIdsTooltip.container)).not.toBeInTheDocument();
  });

  it('render with title "unoccupied slot" content when there is no data', async () => {
    const { queryByTestId } = await renderContainerSummaryTooltip({});

    expect(queryByTestId(dataTestIdsTooltip.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTooltip.title)).toHaveTextContent(UNOCCUPIED_SLOT);
  });

  it('renders correct title when slot has container and material', async () => {
    const resourceWithContainerAndMaterial = mocksResourcesState[0];
    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: { containerLocation: mockFarmDefContainerLocations, resourceState: resourceWithContainerAndMaterial },
    });

    expect(queryByTestId(dataTestIdsTooltip.title)).toHaveTextContent('Table with BAC');
  });

  it('renders correct title when slot has no container or material', async () => {
    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: { containerLocation: mockFarmDefContainerLocations, resourceState: undefined },
    });

    expect(queryByTestId(dataTestIdsTooltip.title)).toHaveTextContent(UNOCCUPIED_SLOT);
  });

  it('renders correct title when slot has container but no material', async () => {
    const resourceWithContainerAndNoMaterial = mocksResourcesState[3];
    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: { containerLocation: mockFarmDefContainerLocations, resourceState: resourceWithContainerAndNoMaterial },
    });

    expect(queryByTestId(dataTestIdsTooltip.title)).toHaveTextContent('Empty table');
  });

  it('renders time in room', async () => {
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
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mocksResourcesState[0],
      lastLoadOperation: mockOperation,
    };

    const today = DateTime.now();

    await renderContainerSummaryTooltip({
      data: defaultMockData,
      selectedDate: today,
    });

    expect(mockGetLoadTime).toHaveBeenCalledWith(new Date(mockOperation.startDt), today);
  });

  it('renders container labels', async () => {
    const mockResourceStateWithContainerLabels = cloneDeep(mocksResourcesState[0]);
    mockResourceStateWithContainerLabels.containerLabels = ['label1', 'label2'];

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithContainerLabels,
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.containerLabels)).toHaveTextContent('label1, label2');
    expect(queryByTestId(dataTestIdsTooltip.materialLabels)).toHaveTextContent('no labels');
  });

  it('render material labels', async () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);
    mockResourceStateWithMaterialLabels.materialLabels = ['label1', 'label2'];

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.materialLabels)).toHaveTextContent('label1, label2');
    expect(queryByTestId(dataTestIdsTooltip.containerLabels)).toHaveTextContent('no labels');
  });

  it('render irrigation status created', async () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
      irrigationExecution: { ...mockIrrigationExecution, status: IrrigationStatus.CREATED },
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.irrigationStatus)).toHaveTextContent('CREATED');
  });

  it('render irrigation status ongoing', async () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
      irrigationExecution: { ...mockIrrigationExecution, status: IrrigationStatus.ONGOING },
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.irrigationStatus)).toHaveTextContent('ONGOING');
  });

  it('render irrigation status success', async () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
      irrigationExecution: { ...mockIrrigationExecution, status: IrrigationStatus.SUCCESS },
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.irrigationStatus)).toHaveTextContent('SUCCESS');
  });

  it('render irrigation status failure', async () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
      irrigationExecution: { ...mockIrrigationExecution, status: IrrigationStatus.FAILURE },
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.irrigationStatus)).toHaveTextContent('FAILURE');
  });

  it('render irrigation status cancelled', async () => {
    const mockResourceStateWithMaterialLabels = cloneDeep(mocksResourcesState[0]);

    const defaultMockData = {
      containerLocation: mockFarmDefContainerLocationsWithTable,
      resourceState: mockResourceStateWithMaterialLabels,
      irrigationExecution: { ...mockIrrigationExecution, status: IrrigationStatus.CANCELLED },
    };

    const { queryByTestId } = await renderContainerSummaryTooltip({
      data: defaultMockData,
    });

    expect(queryByTestId(dataTestIdsTooltip.irrigationStatus)).toHaveTextContent('CANCELLED');
  });
});
