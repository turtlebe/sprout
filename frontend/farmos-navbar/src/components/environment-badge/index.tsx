import { Chip } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';

const dataTestIds = {
  chip: 'environment-badge-chip',
};

export { dataTestIds as dataTestIdsEnvironmentBadge };

export interface EnvironmentBadge {
  isDeveloper: boolean;
}

export const envContextPath = 'plenty.env.ENVIRONMENT_CONTEXT';

export const EnvironmentBadge: React.FC<EnvironmentBadge> = ({ isDeveloper }) => {
  const version = get(window, envContextPath, '');
  const color = version === 'dev' ? 'green' : 'red';

  return version && isDeveloper ? (
    <Chip
      data-testid={dataTestIds.chip}
      label={version}
      style={{ backgroundColor: color, color: 'white' }}
      size="small"
    />
  ) : null;
};
