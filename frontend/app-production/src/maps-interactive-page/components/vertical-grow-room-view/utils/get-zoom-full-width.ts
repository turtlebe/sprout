import { GrowLaneData } from '../hooks/use-vertical-grow-graph-data';

/**
 * This method will return a full width of particular grow lane given the GrowLaneData
 * and the tower width.
 *
 * This is important to get the exact full width in the zoomed in view so we can make sure
 * the scaling matches between the main view and the zoomed in view.
 */
export const getZoomFullWidth = (lanes: GrowLaneData[], towerWidth: number) => {
  return lanes.length ? (lanes[0].endIndex - lanes[0].startIndex || 1) * (towerWidth + 5) : 0;
};
