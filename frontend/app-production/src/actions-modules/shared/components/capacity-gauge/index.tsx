import { useFetchContainerCountByPath } from '@plentyag/app-production/src/actions-modules/hooks/use-fetch-container-count-by-path';
import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, useTheme } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { get } from 'lodash';
import React from 'react';
import v from 'voca';

import { getColorFromPercentage } from './utils/get-color-from-percentage';

const dataTestIds = getScopedDataTestIds(
  {
    loading: 'loading',
    progress: 'progress',
    countAndCapacity: 'count-and-capacity',
    count: 'count',
    capacity: 'capacity',
  },
  'CapacityGauge'
);

export { dataTestIds as dataTestIdsCapacityGauge };

export const GET_COUNT_BY_PATH_URL = '/api/plentyservice/traceability3/get-resource-states-count-by-path';

export interface CapacityGauge {
  farmDefObjectPath: string;
  containerType: 'TOWER' | 'CARRIER';
  propertyKey: string;
  colorEnabled?: boolean;
}

export const CapacityGauge: React.FC<CapacityGauge> = ({
  farmDefObjectPath,
  containerType,
  propertyKey,
  colorEnabled = false,
}) => {
  const buffer = getKindFromPath(farmDefObjectPath, 'machines');
  const bufferName = v(buffer).chain().words().value().join('-').toLowerCase();

  const { data: capacityData, isValidating: isCapacityLoading } = useGetFarmDefObjectByPath(farmDefObjectPath, 1);
  const { data: countData, isLoading: isCountLoading } = useFetchContainerCountByPath(bufferName, [containerType]);

  const theme = useTheme();

  const isLoading = isCapacityLoading || isCountLoading;
  const capacity = get(capacityData, ['properties', propertyKey], 0);
  const percentage = (!isLoading ? countData / capacity : 0) * 100;
  const progressWidth = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
  const color = colorEnabled ? getColorFromPercentage(percentage) : theme.palette.grey[600];

  if (!farmDefObjectPath || !bufferName || !containerType || !propertyKey) {
    return <></>;
  }

  return (
    <Show when={!isLoading} fallback={<CircularProgress data-testid={dataTestIds.loading} size={10} />}>
      <Box display="flex" flexDirection="row" alignItems="center" data-testid={dataTestIds.root}>
        <Box
          bgcolor={theme.palette.grey[100]}
          borderRadius={theme.spacing(1)}
          minWidth={100}
          height={theme.spacing(1.5)}
          marginRight={2}
        >
          <Box
            data-testid={dataTestIds.progress}
            borderRadius={theme.spacing(0.75)}
            bgcolor={color}
            width={`${progressWidth}%`}
            height={theme.spacing(1.5)}
          ></Box>
        </Box>
        <Box width="60px" textAlign="right" data-testid={dataTestIds.countAndCapacity}>
          <span style={{ color }}>{countData}</span>
          <span style={{ color: theme.palette.grey[500] }}>/{capacity}</span>
        </Box>
      </Box>
    </Show>
  );
};
