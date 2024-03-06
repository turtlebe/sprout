import {
  color1Path,
  color2Path,
  outlineAroundColorPaths,
  pinBackgroundPath,
  pinOutlinePath,
} from '@plentyag/app-production/src/maps-interactive-page/assets/draw-multi-crop-pin';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockContainerLocation,
  mockMapStateForTower,
  mockTowerResourceState,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-map-state-data';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash';

import { drawMultiCropPin } from './draw-multi-crop-pin';

const mockGetCropColor = jest.fn().mockImplementation((crop: string) => (crop === 'BAC' ? '#000001' : '#d50032'));

const mockTowerResourceWithMultipleCrops = cloneDeep(mockTowerResourceState);
mockTowerResourceWithMultipleCrops.materialObj.product = 'BAC, SAS';

const mockMapState: MapsState = {
  '123-abc:containerLocation-T1': {
    lastLoadOperation: null,
    resourceState: mockTowerResourceWithMultipleCrops,
  },
};

describe('drawMultiCropPin', () => {
  let node, el;

  beforeEach(() => {
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('renders pin', () => {
    drawMultiCropPin({ getCropColor: mockGetCropColor })({
      mapsState: mockMapState,
      containerLocation: mockContainerLocation,
      el,
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      queryParameters: mockDefaultQueryParameters,
    });

    // renders the root element
    expect(node.outerHTML).toContain(
      '<g class="vg-tower-multi-crop-icon" transform="translate(50, -140)" style="opacity: 1;">'
    );

    // render 5 parts of the multi-crop pin

    // 1. pin background
    expect(node.outerHTML).toContain(`<path d="${pinBackgroundPath}" fill-rule="evenodd" fill="#E0E0E0"></path>`);

    // 2. pin outline
    expect(node.outerHTML).toContain(`<path d="${pinOutlinePath}" fill="#7D7D7D"></path>`);

    // 3. pin color1
    expect(node.outerHTML).toContain(
      `<path d="${color1Path}" fill-rule="evenodd" clip-rule="evenodd" fill="#000001"></path>`
    );

    // 4. pin color2
    expect(node.outerHTML).toContain(
      `<path d="${color2Path}" fill-rule="evenodd" clip-rule="evenodd" fill="#d50032"></path>`
    );

    // 5. pin colors outline
    expect(node.outerHTML).toContain(`<path d="${outlineAroundColorPaths}" fill="#7D7D7D"></path>`);
  });

  it('renders pin at reduced opacity', () => {
    drawMultiCropPin({ getCropColor: mockGetCropColor })({
      mapsState: mockMapState,
      containerLocation: mockContainerLocation,
      el,
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      queryParameters: {
        ...mockDefaultQueryParameters,
        selectedCrops: ['WHC'], // filter applied should cause opacity to be reduced.
      },
    });

    expect(node.outerHTML).toContain(
      '<g class="vg-tower-multi-crop-icon" transform="translate(50, -140)" style="opacity: 0.1;">'
    );
  });

  it('does not render pin for container location that does not have multiple crops', () => {
    drawMultiCropPin({ getCropColor: mockGetCropColor })({
      mapsState: mockMapStateForTower, // does not have multiple crops
      containerLocation: mockContainerLocation,
      el,
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      queryParameters: mockDefaultQueryParameters,
    });

    expect(node.outerHTML).toBe('<svg></svg>');
  });
});
