import React from 'react';

export function renderCircle(
  dimension: { width: number; height: number },
  circle: { cx: number; cy: number; r: number; fill: string }
) {
  return (
    <svg width={dimension.width} height={dimension.height}>
      <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill={circle.fill} />
    </svg>
  );
}
