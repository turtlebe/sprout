import { Error as ErrorIcon } from '@material-ui/icons';
import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { ObjectTreeView, PlentyLink, Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { isEmpty, isObject } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';

import { ContainerData, GetCropColor } from '../../types';
import { getLoadTime } from '../../utils';
import { getResourceLoadedDate } from '../../utils/get-resource-loaded-date';
import { getTitleFromContainerData } from '../../utils/text-helpers';
import { CommentsButton } from '../comments-button';
import { ContainerList } from '../container-list';
import { DrawerWithClose } from '../drawer-with-close';
import { IrrigationTableButton } from '../irrigation-table-button';

import { TableGraph } from './components/table-graph';
import { TowerGraph } from './components/tower-graph';
import { TrayGraph } from './components/tray-graph';
import { useStyles } from './styles';

const dataTestIds = {
  close: 'container-details-drawer-close',
  overline: 'container-details-drawer-overline',
  title: 'container-details-drawer-title',
  errorIcon: 'container-details-drawer-error',
  serialLink: 'container-details-drawer-serial-link',
  containerLabels: 'container-details-drawer-container-labels',
  materialLabels: 'container-details-drawer-material-labels',
};

export { dataTestIds as dataTestIdsDrawer };

interface ContainerDetailsDrawer {
  data: ContainerData;
  selectedDate?: DateTime;
  onClose: () => void;
  getCropColor?: GetCropColor;
}

export const ContainerDetailsDrawer: React.FC<ContainerDetailsDrawer> = ({
  data,
  selectedDate,
  onClose,
  getCropColor,
}) => {
  const containerLocation = data?.containerLocation;
  const containerObj = data?.resourceState?.containerObj;
  const materialObj = data?.resourceState?.materialObj;
  const materialAttributes = data?.resourceState?.materialAttributes;
  const conflicts = data?.conflicts;
  const hasError = conflicts?.length > 0;
  const drawerWidth = 400;
  const resourceLoadedDate = getResourceLoadedDate(data);

  const classes = useStyles({ containerType: containerObj?.containerType });
  const { resourcesPageBasePath } = useMapsInteractiveRouting();

  const line = getKindFromPath(containerLocation?.path, 'lines');
  const machine = getKindFromPath(containerLocation?.path, 'machines');

  const title = (
    <Box mt={0.5}>
      <Show when={Boolean(containerLocation)}>
        <Typography variant="overline" className={classes.ancestors} data-testid={dataTestIds.overline}>
          {line} / {machine} / {containerLocation?.name} {data?.positionInParent ? `/ ${data?.positionInParent}` : ''}
        </Typography>
      </Show>
      <Typography variant="h6" data-testid={dataTestIds.title}>
        <Show when={hasError}>
          <ErrorIcon color="error" className={classes.errorIcon} data-testid={dataTestIds.errorIcon} />
        </Show>
        {getTitleFromContainerData(data)}
      </Typography>
    </Box>
  );

  return (
    <DrawerWithClose
      open={Boolean(data)}
      onClose={onClose}
      drawerWidth={drawerWidth}
      title={title}
      closeDataTestId={dataTestIds.close}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexGrow={1} mb={2}>
        <Show when={containerObj?.containerType === 'TABLE'}>
          <TableGraph data={data} getCropColor={getCropColor} selectedDate={selectedDate} />
        </Show>
        <Show when={containerObj?.containerType === 'TRAY'}>
          <TrayGraph data={data} getCropColor={getCropColor} />
        </Show>
        <Show when={containerObj?.containerType === 'TOWER'}>
          <TowerGraph data={data} getCropColor={getCropColor} />
        </Show>
        <Show when={conflicts?.length > 0}>
          <Box height="100%" width="100%" pt={2}>
            <Typography className={classes.instructions}>Containers assigned to this location:</Typography>
            <ContainerList
              containers={conflicts}
              getCropColor={getCropColor}
              resourcesPageBasePath={resourcesPageBasePath}
            />
          </Box>
        </Show>
      </Box>
      <Box display="flex" gridGap="0.5rem" my={2} flexDirection="column" alignItems="start">
        <IrrigationTableButton data={data} parentWidth={drawerWidth} />
        <CommentsButton data={data} parentWidth={drawerWidth} />
      </Box>
      <Box mb={1}>
        <Show when={Boolean(containerObj?.serial)}>
          <Typography paragraph variant="overline" className={classes.fieldLabel}>
            Serial
          </Typography>
          <Typography paragraph className={classes.fieldValue}>
            <PlentyLink
              data-testid={dataTestIds.serialLink}
              to={`${resourcesPageBasePath}?q=${containerObj?.serial}`}
              openInNewTab
            >
              <b>{containerObj?.serial}</b>
            </PlentyLink>
          </Typography>
        </Show>
        <Show when={Boolean(resourceLoadedDate)}>
          <Typography paragraph variant="overline" className={classes.fieldLabel}>
            Time in room
          </Typography>
          <Typography paragraph className={classes.fieldValue}>
            <b>{getLoadTime(resourceLoadedDate, selectedDate)}</b>
          </Typography>
        </Show>
        <Show when={isObject(materialAttributes) && !isEmpty(materialAttributes)}>
          <Typography paragraph variant="overline" className={classes.fieldLabel}>
            Material Attributes
          </Typography>
          <ObjectTreeView
            treeViewClassName={classes.treeView}
            treeViewItemClassName={classes.treeViewItem}
            object={materialAttributes}
            formatValue
          />
        </Show>
        <Show when={Boolean(materialObj?.lotName)}>
          <Typography paragraph variant="overline" className={classes.fieldLabel}>
            Lot Name
          </Typography>
          <Typography paragraph className={classes.fieldValue}>
            <b>{materialObj?.lotName}</b>
          </Typography>
        </Show>
        <Show when={Boolean(containerObj)}>
          <Typography paragraph variant="overline" className={classes.fieldLabel}>
            Container Labels
          </Typography>
          <Typography data-testid={dataTestIds.containerLabels} paragraph className={classes.fieldValue}>
            <b>
              <Show when={data?.resourceState?.containerLabels?.length > 0} fallback={<>no labels</>}>
                {data?.resourceState?.containerLabels?.join(', ')}
              </Show>
            </b>
          </Typography>
        </Show>
        <Show when={Boolean(materialObj)}>
          <Typography paragraph variant="overline" className={classes.fieldLabel}>
            Material Labels
          </Typography>
          <Typography data-testid={dataTestIds.materialLabels} paragraph className={classes.fieldValue}>
            <b>
              <Show when={data?.resourceState?.materialLabels?.length > 0} fallback={<>no labels</>}>
                {data?.resourceState?.materialLabels?.join(', ')}
              </Show>
            </b>
          </Typography>
        </Show>
        {/* ToDo: count of trays in table */}
      </Box>
    </DrawerWithClose>
  );
};
