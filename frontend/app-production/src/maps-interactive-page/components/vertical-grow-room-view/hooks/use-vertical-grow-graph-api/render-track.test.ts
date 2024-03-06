import {
  mockLanes,
  mockVerticalGrowGraphScale,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';

import 'jest-canvas-mock';
import { renderTrack } from './render-track';

describe('renderTrack', () => {
  it('renders', () => {
    // ARRANGE
    const canvasEl = document.createElement('canvas');
    const canvasCtx = canvasEl.getContext('2d');

    const renderTrackFn = renderTrack({
      canvasCtx,
      scale: mockVerticalGrowGraphScale,
      svgRef: undefined,
    });

    // ACT
    renderTrackFn({ lanes: mockLanes });

    // ASSERT
    const events = canvasCtx.__getEvents();
    expect(events.length).toEqual(8);
  });
});
