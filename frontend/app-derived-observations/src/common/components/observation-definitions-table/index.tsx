import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { SourceObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import React from 'react';
import { kebabCase } from 'voca';

import { useObservationDefinitionsAgGridConfig } from './hooks';

const getSourceObservationDefinitionsSearchUrl = (type: SourceObservationDefinition['type']) =>
  `/api/swagger/environment-service/derived-observation-definitions-api/search-${kebabCase(type)}s`;

const dataTestIds = {};

export { dataTestIds as dataTestIdsObservationDefinitionsTable };

export interface ObservationDefinitionsTable {
  type: SourceObservationDefinition['type'];
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onGridReady: BaseAgGridInfiniteTable['onGridReady'];
  onSelectionChanged: BaseAgGridInfiniteTable['onSelectionChanged'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
}

/**
 * AgGrid Table displaying an infinite list of {@link BaseObservationDefinition}s or {@link DerivedObservationDefinition}.
 */
export const ObservationDefinitionsTable: React.FC<ObservationDefinitionsTable> = ({
  type,
  onIsLoading,
  onGridReady,
  onSelectionChanged,
  onDatasourceSuccess,
}) => {
  const { config } = useObservationDefinitionsAgGridConfig({ type });

  return (
    <BaseAgGridInfiniteTable
      agGridConfig={config}
      onIsLoading={onIsLoading}
      onGridReady={onGridReady}
      onSelectionChanged={onSelectionChanged}
      onDatasourceSuccess={onDatasourceSuccess}
      url={getSourceObservationDefinitionsSearchUrl(type)}
      requestMethod="POST"
    />
  );
};
