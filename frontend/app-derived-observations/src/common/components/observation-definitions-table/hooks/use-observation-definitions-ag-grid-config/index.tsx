import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { defaultConfig } from '@plentyag/core/src/ag-grid/constants';
import { SelectionFilter } from '@plentyag/core/src/ag-grid/custom-filters/selection-filter';
import { getFilteringServerParams, getSortingQueryParams } from '@plentyag/core/src/ag-grid/helpers';
import { isTextFilterModel } from '@plentyag/core/src/ag-grid/type-guards';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { SourceObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import React from 'react';

import { getBaseObservationDefinitionColumnDefs } from './get-base-observation-definition-column-defs';
import { getDerivedObservationDefinitionColumnDefs } from './get-derived-observation-definition-column-defs';
import { commonFields } from './utils';

const sortingQueryParamsMapping = {
  [commonFields.window]: 'aggregation_window',
  [commonFields.output]: 'stream_output',
};

export interface UseObservationDefinitionsAgGridConfig {
  type: SourceObservationDefinition['type'];
}

export interface UseObservationDefinitionsAgGridConfigReturn {
  config: BaseAgGridInfiniteTable['agGridConfig'];
}

/**
 * AgGrid Config for {@link ObservationDefinitionsTable}.
 */
export const useObservationDefinitionsAgGridConfig = ({
  type,
}: UseObservationDefinitionsAgGridConfig): UseObservationDefinitionsAgGridConfigReturn => {
  const { measurementTypes } = useFetchMeasurementTypes();

  return React.useMemo(
    () => ({
      config: {
        ...defaultConfig,
        frameworkComponents: { selectionFilter: SelectionFilter },
        columnDefs:
          type === 'BaseObservationDefinition'
            ? getBaseObservationDefinitionColumnDefs()
            : getDerivedObservationDefinitionColumnDefs(measurementTypes),
        getSortFilterServerParams: ({ sortModel, filterModel, columnDefs }) => {
          const sort = getSortingQueryParams(sortModel, colId => sortingQueryParamsMapping[colId]);
          const filters = getFilteringServerParams({
            filterModel,
            columnDefs,
            transformColId: (colId, filter) => {
              if (isTextFilterModel(filter) && colId === commonFields.streamName && filter.type === 'contains') {
                return 'streamNameContains';
              }
              if (isTextFilterModel(filter) && colId === commonFields.observationName && filter.type === 'contains') {
                return 'observationNameContains';
              }
              if (isTextFilterModel(filter) && colId === commonFields.path && filter.type === 'contains') {
                return 'pathContains';
              }

              return colId;
            },
          });

          return {
            ...sort,
            ...filters,
          };
        },
      },
    }),
    [type, measurementTypes]
  );
};
