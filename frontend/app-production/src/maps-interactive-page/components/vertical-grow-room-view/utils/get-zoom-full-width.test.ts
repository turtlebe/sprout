import { GrowLaneData } from '../hooks/use-vertical-grow-graph-data';

import { getZoomFullWidth } from './get-zoom-full-width';

describe('getZoomFullWidth', () => {
  it('should return a fixed full width given GrowLaneData and tower width', () => {
    // ARRANGE
    const lanes = [
      {
        laneName: 'A',
        endIndex: 200,
        startIndex: 0,
      } as unknown as GrowLaneData,
    ];

    // ACT
    const result = getZoomFullWidth(lanes, 50);

    // ASSERT
    expect(result).toEqual(11000);
  });

  it('should be able to handle empty GrowLaneData data', () => {
    // ARRANGE
    const lanes = [];

    // ACT
    const result = getZoomFullWidth(lanes, 50);

    // ASSERT
    expect(result).toEqual(0);
  });

  it('should return at minimum the width of one tower', () => {
    // ARRANGE
    const lanes = [
      {
        laneName: 'A',
        endIndex: 1,
        startIndex: 1,
      } as unknown as GrowLaneData,
    ];

    // ACT
    const result = getZoomFullWidth(lanes, 50);

    // ASSERT
    expect(result).toEqual(55);
  });
});
