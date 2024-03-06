import {
  mockLanes,
  mockVerticalGrowGraphScale,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-vertical-grow-data';

import 'jest-canvas-mock';
import { drawTrack } from './draw-track';

describe('drawTrack', () => {
  it('draws', () => {
    // ARRANGE
    const canvasEl = document.createElement('canvas');
    const canvasCtx = canvasEl.getContext('2d');

    // ACT
    drawTrack(canvasCtx, {
      x: 10,
      y: 20,
      width: 100,
      lanes: mockLanes,
      scales: mockVerticalGrowGraphScale.towersScale,
      yScale: mockVerticalGrowGraphScale.lanesScale,
      color: '#ff0000',
    });

    // ASSERT
    const events = canvasCtx.__getEvents();
    expect(events.length).toEqual(8);
    expect(events.find(event => event.type === 'strokeStyle').props.value).toEqual('#ff0000');
  });
});
