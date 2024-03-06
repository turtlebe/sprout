import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  root: 'legend-color-root',
};

export { dataTestIds as dataTestIdsLegendColor };

export interface LegendColor {
  backgroundColor?: string;
  backgroundColorLinearGradient?: [string, string];
  borderColor?: string;
  linearGradientRotate?: number;
}

/**
 * Simple colored div that we use throughout the UI.
 *
 * This is used in <GraphLegend/> and also on the labels of the <Tabs/> of the <MetricPage /> and <SchedulePage />.
 */
export const LegendColor: React.FC<LegendColor> = ({
  backgroundColor,
  borderColor,
  backgroundColorLinearGradient,
  linearGradientRotate = '0',
}) => {
  const computedBackgroundColor = backgroundColorLinearGradient
    ? `repeating-linear-gradient(${linearGradientRotate}deg, ${backgroundColorLinearGradient[0]}, ${backgroundColorLinearGradient[0]} 0.25rem, ${backgroundColorLinearGradient[1]} 0.25rem, ${backgroundColorLinearGradient[1]} 0.5rem )`
    : backgroundColor
    ? backgroundColor
    : undefined;
  return (
    <Box
      style={{
        width: '1rem',
        height: '1rem',
        borderRadius: '8px',
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        background: computedBackgroundColor,
      }}
      data-testid={dataTestIds.root}
    />
  );
};
