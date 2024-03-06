import { Box, Card } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    time: 'time',
    content: 'content',
  },
  'graph-tooltip-non-numerical'
);

export const getGraphTooltipNonNumericalDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export type DataTestIdsGraphTooltipNonNumerical = typeof dataTestIds;

export { dataTestIds as dataTestIdsGraphTooltipNonNumerical };

export interface GraphTooltipNonNumerical {
  'data-testid'?: string;
}
/**
 * Placeholder tooltip used by `renderObservationNonNumerical`.
 */
export const GraphTooltipNonNumerical: React.FC<GraphTooltipNonNumerical> = ({ 'data-testid': dataTestId }) => {
  const dataTestIdsWithPrefix = getGraphTooltipNonNumericalDataTestIds(dataTestId);

  return (
    <Box
      id={dataTestIdsWithPrefix.root}
      data-testid="graph-tooltip-non-numerical"
      style={{ position: 'absolute', display: 'none', whiteSpace: 'pre-wrap', zIndex: 999999 }}
    >
      <Card>
        <Box padding={2}>
          <Box id={dataTestIdsWithPrefix.time} style={{ fontWeight: 'bold' }}></Box>
          <Box id={dataTestIdsWithPrefix.content}></Box>
        </Box>
      </Card>
    </Box>
  );
};
