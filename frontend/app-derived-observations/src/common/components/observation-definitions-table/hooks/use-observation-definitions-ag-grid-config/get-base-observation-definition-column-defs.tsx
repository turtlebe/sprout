import { ColDef } from '@ag-grid-community/all-modules';
import { getWindowDurationLabel } from '@plentyag/app-derived-observations/src/common/utils';
import { PATHS } from '@plentyag/app-derived-observations/src/paths';
import { AgGridLinkRenderer } from '@plentyag/brand-ui/src/components';
import { buildAgTextColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getSelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { Aggregation, Output, WindowDuration } from '@plentyag/core/src/types/derived-observations';
import { DateTimeFormat, getLuxonDateTime, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { baseFields } from './utils';

/**
 * Returns the AgGrid Column Definitions for displaying ObservationDefinitionsTable using the type BaseObservationDefinition.
 */
export function getBaseObservationDefinitionColumnDefs(): ColDef[] {
  return [
    {
      headerName: 'Stream Name',
      field: baseFields.streamName,
      colId: baseFields.streamName,
      checkboxSelection: true,
      cellRendererFramework: params => (
        <AgGridLinkRenderer to={params.data && PATHS.baseObservationDefinitionPage(params.data?.id)}>
          {params.value}
        </AgGridLinkRenderer>
      ),
      ...buildAgTextColumnFilter('contains'),
    },
    {
      field: baseFields.path,
      colId: baseFields.path,
      valueFormatter: params => getShortenedPath(params.data?.observationKey?.path),
      minWidth: 400,
      ...buildAgTextColumnFilter('contains'),
    },
    {
      headerName: 'Observation Name',
      field: baseFields.observationName,
      colId: baseFields.observationName,
      valueFormatter: params => params.data?.observationKey?.observationName,
      ...buildAgTextColumnFilter('contains'),
    },
    {
      field: baseFields.window,
      colId: baseFields.window,

      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        disableOrderBy: true,
        selectableItems: Object.values(WindowDuration).map(duration => ({
          name: getWindowDurationLabel(duration),
          value: duration,
        })),
      },
    },
    {
      field: baseFields.output,
      colId: baseFields.output,
      ...getSelectionFilter(Object.values(Output)),
    },
    {
      field: baseFields.aggregation,
      colId: baseFields.aggregation,
      ...getSelectionFilter(Object.values(Aggregation)),
    },
    {
      field: baseFields.comment,
      colId: baseFields.comment,
    },
    ,
    {
      headerName: 'Created By',
      field: baseFields.createdBy,
      colId: baseFields.createdBy,
    },
    {
      headerName: 'Updated By',
      field: baseFields.updatedBy,
      colId: baseFields.updatedBy,
    },
    {
      headerName: 'Created At',
      field: baseFields.createdAt,
      colId: baseFields.createdAt,
      valueFormatter: params => getLuxonDateTime(params.value).toFormat(DateTimeFormat.VERBOSE_DEFAULT),
    },
    {
      headerName: 'Updated At',
      field: baseFields.updatedAt,
      colId: baseFields.updatedAt,
      valueFormatter: params => getLuxonDateTime(params.value).toFormat(DateTimeFormat.VERBOSE_DEFAULT),
    },
  ];
}
