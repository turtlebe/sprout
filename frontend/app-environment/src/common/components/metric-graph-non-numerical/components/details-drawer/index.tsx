import { Close } from '@material-ui/icons';
import { useFetchNormalizedObservations } from '@plentyag/app-environment/src/common/hooks';
import { getObservationsByTimeRange } from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric, ObservationsByTime, TimeGranularity } from '@plentyag/core/src/types/environment';
import moment from 'moment';
import React from 'react';

import { TableNormalizedObservations } from '../table-normalized-observations';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'details-drawer',
  title: 'details-drawer-title',
  close: 'details-drawer-close',
};

export { dataTestIds as dataTestIdsDetailsDrawer };

export interface DetailsDrawer {
  metric: Metric;
  observationsByTime: ObservationsByTime;
  timeGranularity: TimeGranularity;
  valueAttribute: string;
  onClose: () => void;
}

export const DetailsDrawer: React.FC<DetailsDrawer> = ({
  metric,
  observationsByTime,
  timeGranularity,
  valueAttribute,
  onClose,
}) => {
  const isOpen = Boolean(observationsByTime);
  const classes = useStyles({ show: isOpen });
  const startDateTime = React.useMemo(() => moment.utc(observationsByTime?.rolledUpAt).toDate(), [observationsByTime]);
  const endDateTime = React.useMemo(
    () => moment.utc(startDateTime).add(timeGranularity.value, 'minute').toDate(),
    [startDateTime, timeGranularity]
  );
  const { data: observations = [], isLoading } = useFetchNormalizedObservations(
    observationsByTime && {
      metric,
      startDateTime,
      endDateTime,
    }
  );

  return (
    <Box className={classes.drawer} data-testid={dataTestIds.container} aria-hidden={!isOpen}>
      <Box pl={3} py={2} pr="16px" height="100%" display="flex" flexDirection="column">
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" width="100%">
          <Show when={Boolean(observationsByTime)}>
            <Typography variant="h6" data-testid={dataTestIds.title}>
              {getObservationsByTimeRange(observationsByTime, timeGranularity)}
            </Typography>
          </Show>
          <IconButton
            className={classes.closeIcon}
            size="small"
            color="default"
            icon={Close}
            onClick={onClose}
            data-testid={dataTestIds.close}
          />
        </Box>

        <TableNormalizedObservations
          observations={observations}
          isLoading={isLoading}
          valueAttribute={valueAttribute}
        />
      </Box>
    </Box>
  );
};
