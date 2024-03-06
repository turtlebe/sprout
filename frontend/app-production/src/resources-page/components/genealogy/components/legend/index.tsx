import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { findAllOperations, findAllResourceTypes, getOperationColor } from '../../utils';
import { hasIcon, ResourceIcon } from '../resource-icon';

import { LegendCategory } from './legend-item';
import { renderCircle } from './render-circle';
export interface Legend {
  focusedResource: ProdResources.FocusedResource;
}

export const Legend: React.FC<Legend> = ({ focusedResource }) => {
  const allOperations = findAllOperations(focusedResource);
  const operationTypes = allOperations.map(operation => operation.type);
  const uniqueOperationTypes = [...new Set(operationTypes)];
  const iconDim = 12;
  const circleRadius = iconDim / 2;

  const majorEvents = uniqueOperationTypes.map<{ icon: JSX.Element; name: string }>(opType => {
    return {
      icon: renderCircle(
        { width: iconDim, height: iconDim },
        { cx: circleRadius, cy: circleRadius, r: circleRadius, fill: getOperationColor(opType) }
      ),
      name: opType,
    };
  });

  majorEvents.push({
    icon: renderCircle(
      { width: iconDim, height: iconDim },
      { cx: circleRadius, cy: circleRadius, r: circleRadius, fill: 'url(#diagonalHatch)' }
    ),
    name: 'Overlapping Events',
  });

  const resourceTypes = findAllResourceTypes(allOperations)
    .map(resourceType => {
      if (hasIcon(resourceType)) {
        return {
          icon: <ResourceIcon resourceType={resourceType} width={iconDim} height={iconDim} />,
          name: resourceType,
        };
      }
    })
    .filter(item => item);

  return (
    <Box mt={2}>
      <Typography variant="h6">Legend</Typography>
      <LegendCategory title="Major Events" items={majorEvents} />
      <LegendCategory title="Resources" items={resourceTypes} />
    </Box>
  );
};
