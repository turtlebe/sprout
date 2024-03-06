import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockConflictMapStateForTower,
  mockContainerLocation,
  mockMapStateForTower,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-map-state-data';
import * as d3 from 'd3';

import { drawConflictPin } from './draw-conflict-pin';

describe('drawConflictPin', () => {
  let node, el;

  beforeEach(() => {
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('renders conflict pin', () => {
    drawConflictPin({
      mapsState: mockConflictMapStateForTower,
      containerLocation: mockContainerLocation,
      el,
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      queryParameters: mockDefaultQueryParameters,
    });

    expect(node.outerHTML).toBe(
      '<svg><g class="vg-tower-conflict" transform="translate(10, 20)"><rect rx="2" x="10" y="15" width="80" height="120" fill="#cccccc"></rect><g class="vg-tower-conflict-icon" transform="translate(40, -160)"><path d="M17.9943 16.0086C19.2536 14.3358 20 12.2551 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 12.2551 0.746442 14.3358 2.00573 16.0086L10.0001 28L17.9943 16.0086ZM9 16V14H11V16H9ZM9 6V12H11V6H9Z" fill-rule="evenodd" clip-rule="evenodd" fill="#d50032" style="opacity: 1;"></path></g></g></svg>'
    );
  });

  it('renders conflict pin at reduced opacity', () => {
    drawConflictPin({
      mapsState: mockConflictMapStateForTower,
      containerLocation: mockContainerLocation,
      el,
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      queryParameters: {
        ...mockDefaultQueryParameters,
        selectedCrops: ['BAC'], // filter applied should cause opacity to be reduced.
      },
    });

    expect(node.outerHTML).toBe(
      '<svg><g class="vg-tower-conflict" transform="translate(10, 20)"><rect rx="2" x="10" y="15" width="80" height="120" fill="#cccccc"></rect><g class="vg-tower-conflict-icon" transform="translate(40, -160)"><path d="M17.9943 16.0086C19.2536 14.3358 20 12.2551 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 12.2551 0.746442 14.3358 2.00573 16.0086L10.0001 28L17.9943 16.0086ZM9 16V14H11V16H9ZM9 6V12H11V6H9Z" fill-rule="evenodd" clip-rule="evenodd" fill="#d50032" style="opacity: 0.1;"></path></g></g></svg>'
    );
  });

  it('does not render conflict pin', () => {
    drawConflictPin({
      mapsState: mockMapStateForTower,
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
