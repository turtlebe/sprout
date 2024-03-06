import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { DateTime } from 'luxon';
import { FC } from 'react';

import { ContainerData } from '../../types';
import { getLoadTime } from '../../utils';
import { getResourceLoadedDate } from '../../utils/get-resource-loaded-date';
import { getTitleFromContainerData } from '../../utils/text-helpers';

import { useStyles } from './styles';

const dataTestIds = {
  title: 'container-summary-tooltip-title',
  container: 'container-summary-tooltip',
  containerLabels: 'container-summary-tooltip-contiainer-labels',
  materialLabels: 'container-summary-tooltip-material-labels',
  irrigationStatus: 'container-summary-tooltip-irrigation-status',
  conflictMessage: 'container-summary-tooltip-conflict',
};

export { dataTestIds as dataTestIdsTooltip };

export interface ContainerSummaryTooltip {
  node?: Element;
  data?: ContainerData;
  selectedDate?: DateTime;
}

export const ContainerSummaryTooltip: FC<ContainerSummaryTooltip> = ({ node, data, selectedDate }) => {
  const classes = useStyles({});

  const containerLocation = data?.containerLocation;
  const containerObj = data?.resourceState?.containerObj;
  const materialObj = data?.resourceState?.materialObj;
  const positionInParent = data?.positionInParent;
  const conflicts = data?.conflicts;
  const irrigationExecution = data?.irrigationExecution;

  const containerType = containerLocation?.containerTypes?.[0] ?? 'container';

  const title = getTitleFromContainerData(data);

  const tooltipContent = (
    <Box data-testid={dataTestIds.container}>
      <Typography data-testid={dataTestIds.title} className={classes.tooltipContent}>
        <b>{title}</b>
      </Typography>

      <Show when={Boolean(positionInParent)}>
        <Typography className={classes.tooltipContent}>
          Location: <b>{positionInParent}</b>
        </Typography>
      </Show>

      <Show when={Boolean(containerLocation)}>
        <Typography className={classes.tooltipContent}>
          Location: <b>{containerLocation?.name}</b>
        </Typography>
      </Show>

      <Show when={Boolean(containerObj?.serial)}>
        <Typography className={classes.tooltipContent}>
          Serial: <b>{containerObj?.serial}</b>
        </Typography>
      </Show>

      <Show when={Boolean(getResourceLoadedDate(data))}>
        <Typography className={classes.tooltipContent}>
          Time in room: <b>{getLoadTime(getResourceLoadedDate(data), selectedDate)}</b>
        </Typography>
      </Show>

      <Show when={Boolean(materialObj?.lotName)}>
        <Typography className={classes.tooltipContent}>
          Lot Name: <b>{materialObj?.lotName}</b>
        </Typography>
      </Show>

      <Show when={Boolean(containerObj)}>
        <Typography data-testid={dataTestIds.containerLabels} className={classes.tooltipContent}>
          Container Labels:{' '}
          <b>
            <Show when={data?.resourceState?.containerLabels?.length > 0} fallback={<>no labels</>}>
              {data?.resourceState?.containerLabels?.join(', ')}
            </Show>
          </b>
        </Typography>
      </Show>

      <Show when={Boolean(materialObj)}>
        <Typography data-testid={dataTestIds.materialLabels} className={classes.tooltipContent}>
          Material Labels:{' '}
          <b>
            <Show when={data?.resourceState?.materialLabels?.length > 0} fallback={<>no labels</>}>
              {data?.resourceState?.materialLabels?.join(', ')}
            </Show>
          </b>
        </Typography>
      </Show>

      <Show when={Boolean(irrigationExecution)}>
        <Typography data-testid={dataTestIds.irrigationStatus} className={classes.tooltipContent}>
          Irrigation : <b>{irrigationExecution?.status}</b>
        </Typography>
      </Show>

      <Show when={Boolean(conflicts)}>
        <Typography data-testid={dataTestIds.conflictMessage} className={classes.tooltipContent}>
          There are multiple {containerType.toLowerCase()}s assigned to this location.
        </Typography>
        <Typography data-testid={dataTestIds.conflictMessage} className={classes.tooltipContent}>
          Please select the resource to view more information
        </Typography>
      </Show>
    </Box>
  );

  if (!node) {
    return null;
  }

  // this is trick allows dipslaying a tooltip on a given node using the popper props.
  // the tooltip component requires children so that is the reason for the
  // span (but of course it is not rendered since a different anchor has been provided).
  return (
    <Tooltip
      title={tooltipContent}
      open
      arrow
      placement="top"
      PopperProps={{
        anchorEl: node,
      }}
    >
      <span />
    </Tooltip>
  );
};
