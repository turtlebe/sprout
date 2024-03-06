import { ReactComponent as IrrigationCancelledIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-cancelled-icon.svg';
import { ReactComponent as IrrigationFailureIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-failure-icon.svg';
import { ReactComponent as IrrigationManualIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-manual-icon.svg';
import { ReactComponent as IrrigationPendingIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-pending-icon.svg';
import { ReactComponent as IrrigationSuccessIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-success-icon.svg';
import {
  ContainerEventHandler,
  GetCropColor,
  IrrigationExecution,
  IrrigationExecutionType,
  IrrigationStatus,
  MapsState,
} from '@plentyag/app-production/src/maps-interactive-page/types';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Grid, SvgIcon, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import React, { useEffect, useRef } from 'react';

import { useTableGraphApi } from '../../hooks/use-table-graph-api';
import { useTableGraphData } from '../../hooks/use-table-graph-data';
import { useTableGraphScale } from '../../hooks/use-table-graph-scale';

import { useStyles } from './styles';

const dataTestIds = {
  container: 'table-graph-content',
  irrigationBox: (state: IrrigationStatus) => `table-irrigation-${state}-box`,
  irrigationStatusIcon: 'table-irrigation-status-icon',
  irrigationTypeIcon: 'table-irrigation-type-icon',
};

export { dataTestIds as dataTestIdsTableGraphContent };

interface TableGraphContent {
  siteName?: string;
  tablesState?: MapsState;
  getCropColor?: GetCropColor;
  irrigationExecution?: IrrigationExecution;
  onTrayClick?: ContainerEventHandler;
  onTrayEnter?: ContainerEventHandler;
  onTrayExit?: ContainerEventHandler;
}

export const TableGraphContent: React.FC<TableGraphContent> = ({
  siteName,
  tablesState,
  getCropColor,
  irrigationExecution,
  onTrayClick,
  onTrayEnter,
  onTrayExit,
}) => {
  const classes = useStyles({});

  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const refSize = useResizeObserver(ref);
  const { tableRows } = useTableGraphData({ siteName, traysState: tablesState });
  const scale = useTableGraphScale({ siteName, ...refSize });
  const { clear, renderTrays, renderCoodinates } = useTableGraphApi({ ref, svgRef, scale });

  // Render
  useEffect(() => {
    if (tableRows?.length && svgRef?.current && refSize?.width && refSize?.height) {
      renderTrays({ rows: tableRows, getCropColor, onEnter: onTrayEnter, onExit: onTrayExit, onClick: onTrayClick });
      renderCoodinates({ rows: tableRows });
    }
    return () => {
      clear();
    };
  }, [tableRows, svgRef, refSize]);

  const getIrrigationStatusIconAsReactComponent = status => {
    switch (status) {
      case 'CANCELLED':
        return IrrigationCancelledIcon;
      case 'FAILURE':
        return IrrigationFailureIcon;
      case 'SUCCESS':
        return IrrigationSuccessIcon;
      // All other statuses (i.e. CREATED, ONGOING) default to Pending icon
      // until new icons are requested
      default:
        return IrrigationPendingIcon;
    }
  };

  const getIrrigationBoxClass = status => {
    switch (status) {
      case 'SUCCESS':
        return classes.irrigationSuccessBox;
      // All other statuses (i.e. CREATED, CANCELLED, FAILURE, ONGOING) default to Pending box
      default:
        return classes.irrigationPendingBox;
    }
  };

  return (
    <Grid container spacing={2} className={classes.diagramContainer} data-testid={dataTestIds.container}>
      <Grid item xs={Boolean(irrigationExecution?.status) ? 8 : 12} ref={ref}>
        <svg ref={svgRef} className={classes.svgChart} width={refSize.width} height={refSize.height} />
      </Grid>
      <Show when={Boolean(irrigationExecution?.status)}>
        <Grid item xs={4}>
          <Box p={2} mt={3} className={getIrrigationBoxClass(irrigationExecution?.status)}>
            <Typography align="center" data-testid={dataTestIds.irrigationBox(irrigationExecution?.status)}>
              Irrigation
            </Typography>
            <Box className={classes.irrigationStatusIconWrapper} data-testid={dataTestIds.irrigationStatusIcon}>
              <SvgIcon
                component={getIrrigationStatusIconAsReactComponent(irrigationExecution?.status)}
                viewBox="0 0 23 32"
              />
              <Show when={Boolean(irrigationExecution?.type == IrrigationExecutionType.MANUAL)}>
                <Box className={classes.irrigationTypeIconWrapper} data-testid={dataTestIds.irrigationTypeIcon}>
                  <SvgIcon component={IrrigationManualIcon} viewBox="0 0 20 17" />
                </Box>
              </Show>{' '}
              <b>{irrigationExecution?.status}</b>
            </Box>
          </Box>
        </Grid>
      </Show>
    </Grid>
  );
};
