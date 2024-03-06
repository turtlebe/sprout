import { GrowLaneDirection } from '../../types';

export const drawTrack = (ctx, { x, y, width, lanes, scales, yScale, color }: any): void => {
  // path
  ctx.beginPath();
  ctx.moveTo(x, yScale(0) + y);

  // draw the path
  lanes.forEach((lane, laneIndex) => {
    const laneScaling = scales[lane?.laneName || 'default'];
    const direction = laneScaling.name;

    if (direction === GrowLaneDirection.RIGHT) {
      ctx.lineTo(x + width, yScale(laneIndex) + y);
    } else if (direction === GrowLaneDirection.RIGHT_DOWN) {
      ctx.lineTo(x + width, yScale(laneIndex) + yScale(1) + y);
    } else if (direction === GrowLaneDirection.LEFT) {
      ctx.lineTo(x, yScale(laneIndex) + y);
    } else if (direction === GrowLaneDirection.LEFT_DOWN) {
      ctx.lineTo(x, yScale(laneIndex) + yScale(1) + y);
    }
  });

  // attributes
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
};
