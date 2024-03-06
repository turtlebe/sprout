import { ColDef } from '@ag-grid-community/all-modules';
import { getWindowDurationLabel } from '@plentyag/app-derived-observations/src/common/utils';
import { PATHS } from '@plentyag/app-derived-observations/src/paths';
import { AgGridLinkRenderer } from '@plentyag/brand-ui/src/components';
import {
  buildAgTextColumnFilter,
  defaultAgTextContainsColumnFilter,
} from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { getSelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { FarmDefMeasurementType } from '@plentyag/core/src/farm-def/types';
import { Output, WindowDuration } from '@plentyag/core/src/types/derived-observations';
import { DateTimeFormat, getLuxonDateTime, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { derivedFields } from './utils';

/**
 * Returns the AgGrid Column Definitions for displaying ObservationDefinitionsTable using the type DerivedObservationDefinition.
 */
export function getDerivedObservationDefinitionColumnDefs(measurementTypes: FarmDefMeasurementType[]): ColDef[] {
  return [
    {
      headerName: 'Stream Name',
      field: derivedFields.streamName,
      colId: derivedFields.streamName,
      checkboxSelection: true,
      cellRendererFramework: params => (
        <AgGridLinkRenderer to={params.data && PATHS.derivedObservationDefinitionPage(params.data?.id)}>
          {params.value}
        </AgGridLinkRenderer>
      ),
      ...buildAgTextColumnFilter('contains'),
    },
    {
      headerName: 'Output Path',
      field: derivedFields.path,
      colId: derivedFields.path,
      valueFormatter: params => getShortenedPath(params.data?.observationKey?.path),
      minWidth: 400,
      ...buildAgTextColumnFilter('contains'),
    },
    {
      headerName: 'Output Observation Name',
      field: derivedFields.observationName,
      colId: derivedFields.observationName,
      valueFormatter: params => params.data?.observationKey?.observationName,
      ...buildAgTextColumnFilter('contains'),
    },
    {
      headerName: 'Output Measurement Type',
      field: derivedFields.measurementType,
      colId: derivedFields.measurementType,
      ...getSelectionFilter(measurementTypes.map(measurementType => measurementType.key)),
    },
    {
      headerName: 'Output Unit',
      field: derivedFields.unit,
      colId: derivedFields.unit,
    },
    {
      headerName: 'Source Stream Names',
      field: derivedFields.sourceStreamNames,
      colId: derivedFields.sourceStreamNames,
      valueFormatter: params => params.data?.sourceStreamNames.join(', '),
      sortable: false,
    },
    {
      headerName: 'Expression',
      field: derivedFields.expression,
      colId: derivedFields.expression,
      ...defaultAgTextContainsColumnFilter,
    },
    {
      field: derivedFields.window,
      colId: derivedFields.window,
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
      field: derivedFields.output,
      colId: derivedFields.output,
      ...getSelectionFilter(Object.values(Output)),
    },
    ,
    {
      headerName: 'Created By',
      field: derivedFields.createdBy,
      colId: derivedFields.createdBy,
    },
    {
      headerName: 'Updated By',
      field: derivedFields.updatedBy,
      colId: derivedFields.updatedBy,
    },
    {
      headerName: 'Created At',
      field: derivedFields.createdAt,
      colId: derivedFields.createdAt,
      valueFormatter: params => getLuxonDateTime(params.value).toFormat(DateTimeFormat.VERBOSE_DEFAULT),
    },
    {
      headerName: 'Updated At',
      field: derivedFields.updatedAt,
      colId: derivedFields.updatedAt,
      valueFormatter: params => getLuxonDateTime(params.value).toFormat(DateTimeFormat.VERBOSE_DEFAULT),
    },
  ];
}
