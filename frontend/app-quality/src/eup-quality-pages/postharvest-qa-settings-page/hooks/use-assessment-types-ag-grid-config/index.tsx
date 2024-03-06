import { AssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { defaultAgTextContainsColumnFilter } from '@plentyag/core/src/ag-grid/custom-filters/default-text-filters';
import { useExtendedAgGridWithRowReorder } from '@plentyag/core/src/hooks';
import { Metric } from '@plentyag/core/src/types/environment';
import { useMemo } from 'react';

import { DeleteAssessmentTypeButton } from '../../components/delete-assessment-type-button';
import { EditAssessmentTypeButton } from '../../components/edit-assessment-type-button';
import { MetricStatus } from '../../components/metric-status';
import { getObservationFailName } from '../../utils/get-observation-name';

export interface UseAssesesmentTypesAgGridConfig {
  assessmentTypes: AssessmentTypes[];
  metricsRecord: Record<string, Metric>;
  onCreateMetric: () => void;
  onUpdatedAsssessmentType: (...args: any) => void;
  onReorderAssessmentType: (assessmentTypes: AssessmentTypes[]) => void;
}

enum Fields {
  ORDER = 'uiOrder',
  NAME = 'name',
  LABEL = 'label',
  VALUE_TYPE = 'valueType',
  FAIL_METRIC = 'failMetic',
  ACTIONS = 'actions',
}

export const useAssesesmentTypesAgGridConfig = ({
  assessmentTypes,
  metricsRecord,
  onCreateMetric = () => {},
  onUpdatedAsssessmentType = () => {},
  onReorderAssessmentType = () => {},
}: UseAssesesmentTypesAgGridConfig): BaseAgGridClientSideTable['agGridConfig'] => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Name',
        field: Fields.NAME,
        colId: Fields.NAME,
        valueGetter: row => row.data.name,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Label',
        field: Fields.LABEL,
        colId: Fields.LABEL,
        valueGetter: row => row.data.label,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Value Type',
        field: Fields.VALUE_TYPE,
        colId: Fields.VALUE_TYPE,
        valueGetter: row => row.data.valueType,
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: 'Fail Metric',
        field: Fields.FAIL_METRIC,
        colId: Fields.FAIL_METRIC,
        valueGetter: row => getObservationFailName(row.data.name),
        cellRendererFramework: params => {
          const value = params.getValue();
          return (
            <Box display="flex" alignItems="center">
              <MetricStatus metric={metricsRecord[value]} observationName={value} onCreateMetric={onCreateMetric} />
            </Box>
          );
        },
        ...defaultAgTextContainsColumnFilter,
      },
      {
        headerName: '',
        field: Fields.ACTIONS,
        colId: Fields.ACTIONS,
        minWidth: 100,
        valueGetter: row => row.data,
        cellRendererFramework: params => {
          const assessmentType = params.getValue();
          return (
            <Box display="flex" alignItems="center">
              <EditAssessmentTypeButton assessmentType={assessmentType} onSuccess={onUpdatedAsssessmentType} />
              <DeleteAssessmentTypeButton assessmentType={assessmentType} onDelete={onUpdatedAsssessmentType} />
            </Box>
          );
        },
      },
    ],
    [metricsRecord]
  );

  const agGridConfig = {
    ...defaultConfig,
    components: {},
    columnDefs,
    rowData: assessmentTypes,
    getRowNodeId: rowData => rowData?.id, // unique id for each row.
    immutableData: true,
  };

  const extendedAgGridConfig = useExtendedAgGridWithRowReorder({
    agGridConfig,
    onRowReorder: (_, assessmentTypes: AssessmentTypes[]) => onReorderAssessmentType(assessmentTypes),
  });

  return extendedAgGridConfig;
};
