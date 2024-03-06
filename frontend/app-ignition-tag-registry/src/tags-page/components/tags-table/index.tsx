import { useTagsAgGridConfig } from '@plentyag/app-ignition-tag-registry/src/common/hooks';
import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const SEARCH_TAGS_URL = '/api/swagger/farm-def-service/tags-api/search-tags';

const dataTestIds = {
  loader: 'tags-table-loader',
};

export { dataTestIds as dataTestIdsTagsTable };

export interface TagsTable {
  onIsLoading: BaseAgGridInfiniteTable['onIsLoading'];
  onGridReady: BaseAgGridInfiniteTable['onGridReady'];
  onSelectionChanged: BaseAgGridInfiniteTable['onSelectionChanged'];
  onDatasourceSuccess: BaseAgGridInfiniteTable['onDatasourceSuccess'];
}

/**
 * AgGrid Table rendering infinite list of Tags.
 */
export const TagsTable: React.FC<TagsTable> = ({
  onIsLoading,
  onGridReady,
  onSelectionChanged,
  onDatasourceSuccess,
}) => {
  const tagsAgGridConfig = useTagsAgGridConfig();
  const { config, isValidating } = tagsAgGridConfig;

  if (isValidating) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
        <CircularProgress size="2rem" data-testid={dataTestIds.loader} />
      </Box>
    );
  }
  return (
    <BaseAgGridInfiniteTable
      agGridConfig={config}
      onIsLoading={onIsLoading}
      onGridReady={onGridReady}
      onSelectionChanged={onSelectionChanged}
      onDatasourceSuccess={onDatasourceSuccess}
      url={SEARCH_TAGS_URL}
      requestMethod="POST"
    />
  );
};
