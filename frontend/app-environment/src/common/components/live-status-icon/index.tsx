import { Cancel, CheckCircle, Help } from '@material-ui/icons';
import { useGetLiveStatusColor } from '@plentyag/app-environment/src/common/hooks';
import { LiveStatus } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = {
  root: 'title-icon',
  noData: 'tile-icon-no-data',
  outOfRange: 'tile-icon-out-of-range',
  inRange: 'tile-icon-in-range',
};

export { dataTestIds as dataTestIdsLiveStatusIcon };

export const getLiveStatusIconDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export interface LiveStatusIcon {
  status: LiveStatus;
  fontSize?: 'large' | 'small';
  'data-testid'?: string;
}

/**
 * Render an Icon that indicates a status for a given AlertRule Or Metric: In Range, Out of Range, No Data.
 */
export const LiveStatusIcon: React.FC<LiveStatusIcon> = ({ 'data-testid': dataTestId, status, fontSize = 'large' }) => {
  const color = useGetLiveStatusColor(status);
  const dataTestIdsWithPrefix = getLiveStatusIconDataTestIds(dataTestId);

  if (LiveStatus.noData === status) {
    return <Help data-testid={dataTestIdsWithPrefix.noData} fontSize={fontSize} style={{ color }} />;
  }

  if (LiveStatus.outOfRange === status) {
    return <Cancel data-testid={dataTestIdsWithPrefix.outOfRange} fontSize={fontSize} style={{ color }} />;
  }

  return <CheckCircle data-testid={dataTestIdsWithPrefix.inRange} fontSize={fontSize} style={{ color }} />;
};
