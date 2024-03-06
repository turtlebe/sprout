import { ERROR_COLOR } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockFarmDefContainerLocationsWithTable } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';
import { DateTime } from 'luxon';
import React from 'react';

import { drawGerminationTable } from './draw-germination-table';
import {
  CONTAINER_CLASS,
  dataTestIdsGerminationLineRenderGraph,
  NAME_CLASS,
  renderGraph,
  TABLE_CONTAINER_CLASS,
  TABLE_SERIAL_CLASS,
} from './render-graph';

jest.mock('./draw-germination-table');
const mockDrawGerminationTable = drawGerminationTable as jest.Mock;

// has both container and material, product has multiple crops.
const containerRef = mockFarmDefContainerLocationsWithTable.ref as string;
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

describe('renderGraph', () => {
  let node, ref, scale, containerLocations;

  beforeEach(() => {
    // ARRANGE
    // -- mock data
    containerLocations = {
      [mockFarmDefContainerLocationsWithTable.name]: mockFarmDefContainerLocationsWithTable,
    };

    // -- create dimensions and yScale
    scale = {
      width: 100,
      height: 200,
      paddingX: 10,
      paddingY: 10,
      y: d3.scaleLinear().domain([0, 1]).range([0, 200]),
    };

    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;

    mockDrawGerminationTable.mockClear();

    // mock this since isn't defined in jsom
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      writable: true,
      value: () => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }),
    });
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
    expect(node.querySelectorAll(`.${TABLE_CONTAINER_CLASS}`).length).toBe(1);
    expect(node.querySelector(`.${TABLE_CONTAINER_CLASS} .${NAME_CLASS}`)).toBeDefined();

    // -- check testid of a specific table
    const specificTableTestId = dataTestIdsGerminationLineRenderGraph.table(containerLocations.Bay1.ref);
    expect(node.querySelector(`[data-testid='${specificTableTestId}']`)).toBeDefined();
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

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: mockGetCropColor,
      mapsState: mockMapsState,
    });

    // ASSERT
    expect(mockDrawGerminationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        tableColor: mockCropColorMap.B11,
        secondTableColor: mockCropColorMap.BAC,
        tableOpacity: 1.0,
      })
    );
  });

  it('renders table with reduced opacity', () => {
    // ARRANGE
    // -- setup
    const selectedAgeCohortDate = DateTime.fromSQL('2021-02-11').toJSDate();

    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // has both container and material, product has multiple crops.
    const containerRef = mockFarmDefContainerLocationsWithTable.ref as string;
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
        lastLoadOperation: {
          startDt: '2021-02-09T22:13:57.504Z',
        } as unknown as ProdResources.Operation,
      },
    };

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: jest.fn(),
      mapsState: mockMapsState,
      queryParameters: {
        ...mockDefaultQueryParameters,
        ageCohortDate: selectedAgeCohortDate,
      },
    });

    // ASSERT
    expect(mockDrawGerminationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        tableOpacity: 0.1,
      })
    );
  });

  it('renders with error if conflicts is found', () => {
    // ARRANGE
    // -- setup
    const selectedAgeCohortDate = DateTime.fromSQL('2021-02-11').toJSDate();
    const renderGraphFn = renderGraph({
      ref,
      scale,
    });

    // has both container and material, product has multiple crops.
    const containerRef = mockFarmDefContainerLocationsWithTable.ref as string;
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
      queryParameters: {
        ...mockDefaultQueryParameters,
        ageCohortDate: selectedAgeCohortDate,
      },
    });

    // ASSERT
    expect(mockDrawGerminationTable).toHaveBeenCalledWith(
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

    // ACT
    renderGraphFn({
      containerLocations,
      getCropColor: jest.fn(),
      mapsState: mockMapsState,
      queryParameters: {
        ...mockDefaultQueryParameters,
        showSerials: true,
      },
    });

    const el = node.querySelector(`.${TABLE_SERIAL_CLASS}`);
    expect(el).toHaveTextContent(':abc');
  });
});
