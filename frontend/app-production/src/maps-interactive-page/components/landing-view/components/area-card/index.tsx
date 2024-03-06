import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { LineClassDisplayName } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Box, Card, Link, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefArea } from '@plentyag/core/src/farm-def/types';
import React from 'react';
import { NavLink } from 'react-router-dom';

const dataTestIds = {
  container: 'area-card',
  displayName: 'area-card-display-name',
  card: (name: string) => `area-card-${name}`,
};

export { dataTestIds as dataTestIdsAreaCard };

interface AreaCard {
  area: FarmDefArea;
}

export const AreaCard: React.FC<AreaCard> = ({ area }) => {
  const { getMapsInteractiveRoute } = useMapsInteractiveRouting();

  const lines = Object.values(area.lines);

  // Grab the first line to get the common class
  const firstLine = lines[0];
  const displayClassName = LineClassDisplayName[firstLine.class];

  return (
    <Card key={area.name} data-testid={dataTestIds.container}>
      <Box data-testid={dataTestIds.card(area.name)} m={1}>
        <Typography variant="h5">{area.displayName}</Typography>
        <Typography variant="subtitle1">
          {displayClassName}: {lines.length}
        </Typography>
        {lines.map(line => (
          <div key={line.name}>
            <Link component={NavLink} to={getMapsInteractiveRoute(area.name, line.name)}>
              {line.displayName}
            </Link>
          </div>
        ))}
      </Box>
    </Card>
  );
};
