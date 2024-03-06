import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockMapStateForTower } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-map-state-data';
import {
  mockLanes,
  mockVerticalGrowGraphScale,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';
import { cloneDeep } from 'lodash';

import { drawRoundedRect } from './draw-rounded-rect';
import 'jest-canvas-mock';
import { renderTowers } from './render-towers';

jest.mock('./draw-rounded-rect');
const mockDrawRoundedRect = drawRoundedRect as jest.Mock;

describe('renderTowers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGetCropColor = jest.fn();
  const mockMapState = {}; // empty mock state

  function renderTowersWrapper() {
    const canvasEl = document.createElement('canvas');
    const canvasCtx = canvasEl.getContext('2d');

    const renderTowersFn = renderTowers({
      canvasCtx,
      scale: mockVerticalGrowGraphScale,
      svgRef: undefined,
    });

    const mockGetCropColor = jest.fn().mockImplementation((crop: string) => (crop === 'MZC' ? '#000001' : '#d50032'));

    return { renderTowersFn, mockGetCropColor, canvasCtx };
  }

  it('renders', () => {
    // for this test want to use real implementation of drawRoundedRect
    const actualImpl = jest.requireActual('./draw-rounded-rect');
    mockDrawRoundedRect.mockImplementation(actualImpl.drawRoundedRect);

    const { renderTowersFn, canvasCtx } = renderTowersWrapper();

    // ACT
    renderTowersFn({
      lanes: mockLanes,
      mapsState: mockMapState,
      queryParameters: mockDefaultQueryParameters,
      getCropColor: mockGetCropColor,
    });

    // ASSERT
    const events = canvasCtx.__getEvents();
    expect(events.length).toEqual(132);
  });

  it('renders tower with same colors', () => {
    const { renderTowersFn, canvasCtx, mockGetCropColor } = renderTowersWrapper();

    renderTowersFn({
      lanes: mockLanes,
      mapsState: mockMapStateForTower, // has just one crop in tower MZC
      queryParameters: mockDefaultQueryParameters,
      getCropColor: mockGetCropColor,
    });

    expect(mockDrawRoundedRect).toHaveBeenCalledTimes(6);

    // both halves of the rectangle should have the same color, since there is only one crop in the tower.
    expect(mockDrawRoundedRect).toHaveBeenNthCalledWith(
      1,
      canvasCtx,
      expect.objectContaining({
        upperLeftHalfFillColor: '#000001',
        lowerRightHalfFillColor: '#000001',
      })
    );
  });

  it('renders tower with two colors', () => {
    const { renderTowersFn, canvasCtx, mockGetCropColor } = renderTowersWrapper();

    // create a tower with two crops, so we get rectangle drawn with two colors.
    const mockMapStateForTowerWithTwoCrops = cloneDeep(mockMapStateForTower);
    mockMapStateForTowerWithTwoCrops['123-abc:containerLocation-T1'].resourceState.materialObj.product = 'MZC,SAS';

    renderTowersFn({
      lanes: mockLanes,
      mapsState: mockMapStateForTowerWithTwoCrops,
      queryParameters: mockDefaultQueryParameters,
      getCropColor: mockGetCropColor,
    });

    expect(mockDrawRoundedRect).toHaveBeenCalledTimes(6);
    expect(mockDrawRoundedRect).toHaveBeenNthCalledWith(
      1,
      canvasCtx,
      expect.objectContaining({
        upperLeftHalfFillColor: '#000001',
        lowerRightHalfFillColor: '#d50032',
      })
    );
  });
});
