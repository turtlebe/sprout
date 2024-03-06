import { ERROR_COLOR } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockFarmDefContainerLocations,
  mockFarmDefContainerLocationsWithTable,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mockIrrigationTasks } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-irrigation-tasks';
import {
  EMPTY_CONTAINER_COLOR,
  IrrigationExecutionType,
  IrrigationStatus,
  MapsState,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';
import { DateTime } from 'luxon';
import React from 'react';

import { drawPropagationTable } from './draw-propagation-table';
import { CONTAINER_CLASS, NAME_CLASS, renderGraph, TABLE_CLASS } from './render-graph';

jest.mock('./draw-propagation-table');
const mockDrawPropagationTable = drawPropagationTable as jest.Mock;
const mockIrrigationExecution = { ...mockIrrigationTasks[2].executions[0], type: IrrigationExecutionType.SCHEDULED };

function getMockMapsState(startDt?: string, status?: IrrigationStatus, hasComments?: boolean) {
  // has both container and material, product has a single crop.
  const containerRef = mockFarmDefContainerLocations.ref as string;
  const mockMapState: MapsState = {
    [containerRef]: {
      irrigationExecution: { ...mockIrrigationExecution, status: status },
      lastLoadOperation: {
        id: '1',
        type: 'Cult Load Prop Line',
        username: 'test user',
        endDt: '',
        startDt,
        machine: null,
        stateIn: null,
        stateOut: null,
        materialsConsumed: null,
        materialsCreated: null,
      },
      resourceState: {
        id: '888',
        childResourceStateIds: [],
        location: {
          machine: undefined,
        },
        containerObj: {
          createdAt: '',
          id: 'xyz',
          serial: 'serial-abc',
          containerType: 'TABLE',
          properties: {},
        },
        materialObj: {
          id: 'xyz',
          lotName: 'abc',
          materialType: 'LOADED_TABLE',
          product: 'B11',
          properties: {},
        },
        updatedAt: undefined,
        isLatest: true,
      },
      hasComments,
    },
  };

  return mockMapState;
}

function getMockColorMap() {
  const mockCropColorMap = {
    B11: 'red',
  };
  const mockGetCropColor = (cropName: string) => {
    return mockCropColorMap[cropName];
  };
  return { mockCropColorMap, mockGetCropColor };
}

describe('renderGraph', () => {
  let node, ref, scale, containerLocations;

  beforeEach(() => {
    // ARRANGE
    // -- mock data
    containerLocations = {
      [mockFarmDefContainerLocations.name]: mockFarmDefContainerLocations,
    };

    // -- create dimensions and xScale
    scale = {
      width: 100,
      height: 200,
      paddingX: 10,
      paddingY: 10,
      x: d3.scaleLinear().domain([0, 1]).range([0, 200]),
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;

    mockDrawPropagationTable.mockClear();
  });

  it('renders', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // ACT
    renderGraphFn({ containerLocations, getCropColor: undefined, mapsState: {} });

    // ASSERT
    expect(node.querySelector(`.${CONTAINER_CLASS}`)).toBeDefined();
    expect(node.querySelectorAll(`.${TABLE_CLASS}`).length).toBe(1);
    expect(node.querySelector(`.${TABLE_CLASS} .${NAME_CLASS}`)).toBeDefined();
  });

  it('renders table with color based on crop value', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockCropColorMap, mockGetCropColor } = getMockColorMap();

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(),
    });

    // ASSERT
    expect(mockDrawPropagationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        tableColor: mockCropColorMap.B11,
        secondTableColor: undefined,
      })
    );
  });

  describe('renders proper table opacity based on age in room of table', () => {
    it('has opacity 1.0 when "selectedAgeCohortDate" matches load date', () => {
      const renderGraphFn = renderGraph({
        ref,
        scale,
      });

      const { mockGetCropColor } = getMockColorMap();

      const date = '2022-06-05T00:00:00';

      renderGraphFn({
        containerLocations,
        getCropColor: mockGetCropColor,
        mapsState: getMockMapsState(DateTime.fromISO(date).toISO()),
        queryParameters: { ...mockDefaultQueryParameters, ageCohortDate: DateTime.fromISO(date).toJSDate() },
      });

      expect(mockDrawPropagationTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableOpacity: 1.0,
        })
      );
    });

    it('has opactiy 0.1 when "selectedAgeCohortDate" does not match load date', () => {
      const renderGraphFn = renderGraph({
        ref,
        scale,
      });

      const { mockGetCropColor } = getMockColorMap();

      const date = '2022-06-05T00:00:00';

      renderGraphFn({
        containerLocations,
        getCropColor: mockGetCropColor,
        mapsState: getMockMapsState(DateTime.fromISO(date).toISO()),
        queryParameters: {
          ...mockDefaultQueryParameters,
          ageCohortDate: DateTime.fromISO(date).plus({ days: 1 }).toJSDate(),
        },
      });

      expect(mockDrawPropagationTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableOpacity: 0.1,
        })
      );
    });

    it('has opacity 1.0 when "selectedAgeCohortDate" is "all"', () => {
      const renderGraphFn = renderGraph({
        ref,
        scale,
      });

      const { mockGetCropColor } = getMockColorMap();

      const date = '2022-06-05T00:00:00';

      renderGraphFn({
        containerLocations,
        getCropColor: mockGetCropColor,
        mapsState: getMockMapsState(DateTime.fromISO(date).toISO()),
        queryParameters: { ...mockDefaultQueryParameters, ageCohortDate: 'all' },
      });

      expect(mockDrawPropagationTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableOpacity: 1.0,
        })
      );
    });

    it('has opacity 1.0 when "selectedAgeCohortDate" is not provided', () => {
      const renderGraphFn = renderGraph({
        ref,
        scale,
      });

      const { mockGetCropColor } = getMockColorMap();

      const date = '2022-06-05T00:00:00';

      renderGraphFn({
        containerLocations,
        getCropColor: mockGetCropColor,
        mapsState: getMockMapsState(DateTime.fromISO(date).toISO()),
      });

      expect(mockDrawPropagationTable).toHaveBeenCalledWith(
        expect.objectContaining({
          tableOpacity: 1.0,
        })
      );
    });
  });

  it('renders table with empty container color when resouce state contains container but no material', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // has container with no material.
    const containerRef = mockFarmDefContainerLocations.ref as string;
    const mockMapsState: MapsState = {
      [containerRef]: {
        resourceState: {
          id: 'xyz',
          childResourceStateIds: [],
          location: {
            machine: undefined,
          },
          containerObj: {
            createdAt: '',
            id: 'xyz',
            serial: 'serial-abc',
            containerType: 'TABLE',
            properties: {},
          },
          updatedAt: undefined,
          isLatest: true,
        },
      },
    };

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: undefined,
      mapsState: mockMapsState,
    });

    // ASSERT
    expect(mockDrawPropagationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        tableColor: EMPTY_CONTAINER_COLOR,
        secondTableColor: undefined,
      })
    );
  });

  it('renders table with 50/50 diagonal pattern when table contains multiple crops', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const mockCropColorMap = {
      B11: 'red',
      BAC: 'blue',
    };
    const mockGetCropColor = (cropName: string) => {
      return mockCropColorMap[cropName];
    };

    // has both container and material, product has multiple crops.
    const containerRef = mockFarmDefContainerLocations.ref as string;
    const mockMapsState: MapsState = {
      [containerRef]: {
        resourceState: {
          id: 'xyz',
          childResourceStateIds: [],
          location: {
            machine: undefined,
          },
          containerObj: {
            createdAt: '',
            id: 'xyz',
            serial: 'serial-abc',
            containerType: 'TABLE',
            properties: {},
          },
          materialObj: {
            id: 'xyz',
            lotName: 'abc',
            materialType: 'LOADED_TABLE',
            product: 'B11,BAC',
            properties: {},
          },
          updatedAt: undefined,
          isLatest: true,
        },
      },
    };

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: mockMapsState,
    });

    // ASSERT
    expect(mockDrawPropagationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        tableColor: mockCropColorMap.B11,
        secondTableColor: mockCropColorMap.BAC,
      })
    );
  });

  it('renders single SVG even though there is one already in the container', () => {
    // ARRANGE
    // -- mock existing svg
    const existingSvg = document.createElement('svg');
    existingSvg.classList.add(CONTAINER_CLASS);

    // -- add to container node
    node.appendChild(existingSvg);
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;

    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // ACT
    renderGraphFn({ containerLocations, getCropColor: undefined, mapsState: {} });

    // ASSERT
    expect(node.querySelectorAll(`.${CONTAINER_CLASS}`).length).toBe(1);
  });

  it('should seemlessly ignore if element is undefined', () => {
    // ARRANGE
    // -- mock ref
    ref = {
      current: undefined,
    };

    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // ACT
    renderGraphFn({ containerLocations, getCropColor: undefined, mapsState: {} });

    // ASSERT
    expect(node.innerHTML).toBe('');
  });

  it('renders highlight when selectedTable matches container in containerLocations', () => {
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    renderGraphFn({
      containerLocations,
      getCropColor: undefined,
      mapsState: {},
      selectedTable: { containerLocation: mockFarmDefContainerLocations },
    });

    expect(mockDrawPropagationTable).toHaveBeenLastCalledWith(expect.objectContaining({ toHighlight: true }));
  });

  it('does not render highlight when selectedTable does not match the given containerLocations', () => {
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    renderGraphFn({
      containerLocations,
      getCropColor: undefined,
      mapsState: {},
      selectedTable: { containerLocation: mockFarmDefContainerLocationsWithTable },
    });

    expect(mockDrawPropagationTable).toHaveBeenLastCalledWith(expect.objectContaining({ toHighlight: false }));
  });

  it('invokes callback "onClick" when table is clicked', () => {
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const mockOnClick = jest.fn();

    renderGraphFn({ containerLocations, getCropColor: undefined, mapsState: {}, onClick: mockOnClick });

    expect(mockOnClick).not.toHaveBeenCalled();

    const tableEl = node.querySelector(`.${TABLE_CLASS}`);
    tableEl.dispatchEvent(new Event('click'));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('invokes callbacks "onEnter" and "onExit" when mouse enters and leaves table', () => {
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const mockOnEnter = jest.fn();
    const mockOnExit = jest.fn();

    renderGraphFn({
      containerLocations,
      getCropColor: undefined,
      mapsState: {},
      onEnter: mockOnEnter,
      onExit: mockOnExit,
    });

    expect(mockOnEnter).not.toHaveBeenCalled();
    expect(mockOnExit).not.toHaveBeenCalled();

    const tableEl = node.querySelector(`.${TABLE_CLASS}`);

    tableEl.dispatchEvent(new Event('mouseenter'));
    expect(mockOnEnter).toHaveBeenCalled();

    tableEl.dispatchEvent(new Event('mouseleave'));
    expect(mockOnExit).toHaveBeenCalled();

    expect(mockOnEnter).toHaveBeenCalledTimes(1);
    expect(mockOnExit).toHaveBeenCalledTimes(1);
  });

  it('renders with error if conflicts is found', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // has both container and material, product has multiple crops.
    const containerRef = mockFarmDefContainerLocations.ref as string;
    const mockMapsState: MapsState = {
      [containerRef]: {
        resourceState: null,
        conflicts: [
          {
            resourceState: {
              id: 'xyz',
              childResourceStateIds: [],
              location: {
                machine: undefined,
              },
              containerObj: {
                createdAt: '',
                id: 'xyz',
                serial: 'serial-abc',
                containerType: 'TABLE',
                properties: {},
              },
              materialObj: {
                id: 'xyz',
                lotName: 'abc',
                materialType: 'LOADED_TABLE',
                product: 'B11,BAC',
                properties: {},
              },
              updatedAt: undefined,
              isLatest: true,
            },
          },
          {
            resourceState: {
              id: 'abc',
              childResourceStateIds: [],
              location: {
                machine: undefined,
              },
              containerObj: {
                createdAt: '',
                id: 'abc',
                serial: 'serial-def',
                containerType: 'TABLE',
                properties: {},
              },
              materialObj: null,
              updatedAt: undefined,
              isLatest: true,
            },
          },
        ],
      },
    };

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: jest.fn(),
      mapsState: mockMapsState,
    });

    // ASSERT
    expect(mockDrawPropagationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        errorColor: ERROR_COLOR,
        hasError: true,
      })
    );
  });

  it('renders last three digits of table serial', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockGetCropColor } = getMockColorMap();

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(),
      queryParameters: { ...mockDefaultQueryParameters, showSerials: true },
    });

    // has last three digits of table serial
    expect(node.querySelector(`.${TABLE_CLASS} .${NAME_CLASS}`)).toHaveTextContent(':abc');
  });

  it('renders table with an irrigated failure icon', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockGetCropColor } = getMockColorMap();

    const date = '2022-06-05T00:00:00';

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(DateTime.fromISO(date).toISO(), IrrigationStatus.FAILURE),
      queryParameters: { ...mockDefaultQueryParameters, showIrrigationLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).toContain(
      '<svg overflow="visible" class="prop-graph" style="position: absolute; top: 0px; left: 0px;" width="100" height="200"><g class="prop-graph-slot" style="cursor: pointer;"><g data-testid="draw-irrigation-icon-failure"><image href="irrigation-failure-icon.svg" width="23" height="32" x="0" y="18"></image></g><g class="prop-graph-name"><text x="100" y="195" style="text-anchor: middle;"></text></g></g></svg>'
    );
  });

  it('renders table with an irrigated pending icon', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockGetCropColor } = getMockColorMap();

    const date = '2022-06-05T00:00:00';

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(DateTime.fromISO(date).toISO(), IrrigationStatus.CANCELLED),
      queryParameters: { ...mockDefaultQueryParameters, showIrrigationLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).toContain(
      '<svg overflow="visible" class="prop-graph" style="position: absolute; top: 0px; left: 0px;" width="100" height="200"><g class="prop-graph-slot" style="cursor: pointer;"><g data-testid="draw-irrigation-icon-cancelled"><image href="irrigation-cancelled-icon.svg" width="23" height="32" x="0" y="18"></image></g><g class="prop-graph-name"><text x="100" y="195" style="text-anchor: middle;"></text></g></g></svg>'
    );

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(DateTime.fromISO(date).toISO(), IrrigationStatus.CREATED),
      queryParameters: { ...mockDefaultQueryParameters, showIrrigationLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).toContain(
      '<svg overflow="visible" class="prop-graph" style="position: absolute; top: 0px; left: 0px;" width="100" height="200"><g class="prop-graph-slot" style="cursor: pointer;"><g data-testid="draw-irrigation-icon-cancelled"><image href="irrigation-cancelled-icon.svg" width="23" height="32" x="0" y="18"></image></g><g class="prop-graph-name"><text x="100" y="195" style="text-anchor: middle;"></text></g></g></svg>'
    );

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(DateTime.fromISO(date).toISO(), IrrigationStatus.ONGOING),
      queryParameters: { ...mockDefaultQueryParameters, showIrrigationLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).toContain(
      '<svg overflow="visible" class="prop-graph" style="position: absolute; top: 0px; left: 0px;" width="100" height="200"><g class="prop-graph-slot" style="cursor: pointer;"><g data-testid="draw-irrigation-icon-cancelled"><image href="irrigation-cancelled-icon.svg" width="23" height="32" x="0" y="18"></image></g><g class="prop-graph-name"><text x="100" y="195" style="text-anchor: middle;"></text></g></g></svg>'
    );
  });

  it('renders table with an irrigated success icon', () => {
    // ARRANGE
    // -- setup
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockGetCropColor } = getMockColorMap();

    const date = '2022-06-05T00:00:00';

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: getMockMapsState(DateTime.fromISO(date).toISO(), IrrigationStatus.SUCCESS),
      queryParameters: { ...mockDefaultQueryParameters, showIrrigationLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).toContain(
      '<svg overflow="visible" class="prop-graph" style="position: absolute; top: 0px; left: 0px;" width="100" height="200"><g class="prop-graph-slot" style="cursor: pointer;"><g data-testid="draw-irrigation-icon-success"><image href="irrigation-success-icon.svg" width="23" height="32" x="0" y="18"></image></g><g class="prop-graph-name"><text x="100" y="195" style="text-anchor: middle;"></text></g></g></svg>'
    );
  });

  it('renders table without a comment icon', () => {
    // ARRANGE
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockGetCropColor } = getMockColorMap();

    const mapsState = getMockMapsState();

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState,
      queryParameters: { ...mockDefaultQueryParameters, showCommentsLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).not.toContain('data-testid="comment-icon"');
  });

  it('renders table with a comment icon', () => {
    // ARRANGE
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    const { mockGetCropColor } = getMockColorMap();

    const mapsState = getMockMapsState(undefined, undefined, true);

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState,
      queryParameters: { ...mockDefaultQueryParameters, showCommentsLayer: true },
    });

    // ASSERT
    expect(node.innerHTML).toContain('data-testid="comment-icon"');
  });
});
