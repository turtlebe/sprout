import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';
import { InternalIrrigationStatus, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Show, StatusLabel, useFeatureFlag } from '@plentyag/brand-ui/src/components';
import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { DateTimeFormat, getScopedDataTestIds } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { IrrigationTaskTableRowData } from '../../types';
import { getShortenedPathWithoutSiteAndArea } from '../../utils/get-shortened-path-without-site-and-area';
import { mapIrrigationStatusToStatusLabelLevel } from '../../utils/map-irrigation-status-to-status-label-level';
import { IrrigationActions } from '../irrigation-actions';

import { IrrigationTableCell, LocationTableCell } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    expandButton: 'expand-button',
    status: 'status',
    irrigationDate: 'irrigation-date',
    recipeDay: 'recipe-day',
    rackPath: 'rack-path',
    plannedVolume: 'planned-volume',
    trigger: 'trigger',
    failedReason: 'failed-reason',
  },
  'irrigation-table-row'
);

export { dataTestIds as dataTestIdsIrrigationTableRow };

const TABLE_IRRIGATION_FEATURE_FLAG = 'table-irrigation-edit';

export interface IrrigationTableRow {
  rowData: IrrigationTaskTableRowData;
  onRefreshIrrigationTasks: () => void;
}

/**
 * This component renders a single row of the irrigation table.
 */
export const IrrigationTableRow: React.FC<IrrigationTableRow> = ({ rowData, onRefreshIrrigationTasks }) => {
  const showIrrigationActions = useFeatureFlag(TABLE_IRRIGATION_FEATURE_FLAG);
  const [isExpandedRowOpen, setIsExpandedRowOpen] = React.useState(false);

  const isExpandedRowDisabled = rowData.status !== IrrigationStatus.FAILURE;

  const isCreatedOrUnscheduledStatus =
    rowData.status === IrrigationStatus.CREATED || rowData.status === InternalIrrigationStatus.UNSCHEDULED;

  return (
    <>
      <TableRow>
        <IrrigationTableCell>
          <IconButton
            data-testid={dataTestIds.expandButton}
            disabled={isExpandedRowDisabled}
            aria-label="expand row"
            size="small"
            onClick={() => setIsExpandedRowOpen(!isExpandedRowOpen)}
            icon={isExpandedRowOpen ? KeyboardArrowDown : KeyboardArrowRight}
          />
        </IrrigationTableCell>
        <IrrigationTableCell data-testid={dataTestIds.status}>
          <StatusLabel text={rowData.status} level={mapIrrigationStatusToStatusLabelLevel(rowData.status)} />
        </IrrigationTableCell>
        <IrrigationTableCell data-testid={dataTestIds.irrigationDate}>
          {isCreatedOrUnscheduledStatus
            ? DateTime.fromJSDate(rowData.irrigationDate).toFormat(DateTimeFormat.US_DATE_ONLY)
            : DateTime.fromJSDate(rowData.irrigationDate).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS)}
        </IrrigationTableCell>
        <IrrigationTableCell data-testid={dataTestIds.recipeDay}>{rowData.recipeDay}</IrrigationTableCell>
        <LocationTableCell data-testid={dataTestIds.rackPath}>
          <Show when={!isCreatedOrUnscheduledStatus}>{getShortenedPathWithoutSiteAndArea(rowData.rackPath)}</Show>
        </LocationTableCell>
        <IrrigationTableCell data-testid={dataTestIds.plannedVolume}>{rowData?.plannedVolume}</IrrigationTableCell>
        <IrrigationTableCell data-testid={dataTestIds.trigger}>{rowData?.trigger}</IrrigationTableCell>
        <Show when={Boolean(showIrrigationActions)}>
          <IrrigationTableCell>
            <IrrigationActions rowData={rowData} onRefreshIrrigationTasks={onRefreshIrrigationTasks} />
          </IrrigationTableCell>
        </Show>
      </TableRow>

      <Show when={!isExpandedRowDisabled}>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={isExpandedRowOpen} timeout="auto" unmountOnExit>
              <Box m={1}>
                <Typography data-testid={dataTestIds.failedReason}>
                  <b>Failed Reason:</b> {rowData.failureReason || 'No reason provided.'}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Show>
    </>
  );
};
