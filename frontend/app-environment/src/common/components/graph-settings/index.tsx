import { Close, Settings } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DropdownTimeGranularity, DropdownTimeSummarization } from '..';
import { timeGranularities } from '../../utils/constants';

import { useStyles } from './styles';

const dataTestIds = {
  loader: 'graph-settings-loader',
  open: 'graph-settings-open',
  close: 'graph-settings-close',
};

export { dataTestIds as dataTestIdsGraphSettings };

export interface GraphSettings {
  isLoading: boolean;
  startDateTime: DropdownTimeGranularity['startDateTime'];
  endDateTime: DropdownTimeGranularity['endDateTime'];
  timeGranularity: DropdownTimeGranularity['timeGranularity'];
  onTimeSummarizationChanged: DropdownTimeSummarization['onChange'];
  onTimeGranularityChanged: DropdownTimeGranularity['onChange'];
  right?: string;
  downloadIcon?: React.ReactNode;
}

/**
 * Settings of the Graph, currently this allows to conrol the Time Granularity and Summarization of the
 * data displayed on the graph.
 */
export const GraphSettings: React.FC<GraphSettings> = ({
  children,
  downloadIcon,
  isLoading,
  startDateTime,
  endDateTime,
  timeGranularity,
  onTimeSummarizationChanged,
  onTimeGranularityChanged,
  right = '0.5rem',
}) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState<boolean>(false);

  const Loader = ({ isLoading }) => (
    <Show when={isLoading}>
      <CircularProgress size="16px" data-testid={dataTestIds.loader} />
    </Show>
  );

  return (
    <>
      <Box style={{ position: 'absolute', right, top: '0.5rem' }} display="flex" alignItems="center">
        <Loader isLoading={isLoading} />
        {downloadIcon}
        <IconButton color="default" icon={Settings} onClick={() => setOpen(true)} data-testid={dataTestIds.open} />
      </Box>
      <Box className={classes.settingsOverlay} hidden={!open}>
        <Box display="flex" alignItems="center" justifyContent="flex-end" paddingBottom={1}>
          <Loader isLoading={isLoading} />
          <IconButton color="default" icon={Close} onClick={() => setOpen(false)} data-testid={dataTestIds.close} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" paddingBottom={1}>
          <Typography>Time Summarization:</Typography>
          <DropdownTimeSummarization onChange={onTimeSummarizationChanged} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" paddingBottom={1}>
          <Typography>Time Granularity:</Typography>
          <DropdownTimeGranularity
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            timeGranularities={timeGranularities}
            onChange={onTimeGranularityChanged}
          />
        </Box>

        {children}
      </Box>
    </>
  );
};
