import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { useTagsAgGridConfig } from '@plentyag/app-ignition-tag-registry/src/common/hooks';
import { AppBreadcrumbs, AppHeader, AppLayout, ButtonCsvDownloadInfinite } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Tag } from '../common/types';
import { PATHS } from '../paths';

import { ButtonCommit, ButtonCreateTag, ButtonEditTag, DropdownTagActions, TagsTable } from './components';

export const TagsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [tagsCount, setTagsCount] = React.useState<number>(null);
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const tagsAgGridConfig = useTagsAgGridConfig();

  const handleSuccess = () => {
    gridReadyEvent.api.refreshServerSideStore({ purge: true });
    gridReadyEvent.api.deselectAll();
  };

  const handleDatasourceSuccess: TagsTable['onDatasourceSuccess'] = result => {
    setTagsCount(result.meta.total);
  };

  const handleSelectionChanged: TagsTable['onSelectionChanged'] = () => {
    setSelectedTags(gridReadyEvent.api.getSelectedRows());
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={PATHS.tagsPage}
          homePageName={tagsCount ? `Ignition Tags (${tagsCount})` : 'Ignition Tags'}
          marginLeft="0.75rem"
        />
        <Box display="flex">
          <ButtonCsvDownloadInfinite
            gridReadyEvent={gridReadyEvent}
            agGridConfig={tagsAgGridConfig.config}
            fileNamePrefix="itr-tags"
            serviceName="farm-def-service"
            apiName="tags-api"
            operation="search-tags"
          />
          <Box paddingLeft="0.5rem" />
          <ButtonCommit onSuccess={handleSuccess} />
          <Box paddingLeft="0.5rem" />
          <DropdownTagActions onSuccess={handleSuccess} tags={selectedTags} />
          <Box paddingLeft="0.5rem" />
          <ButtonEditTag onSuccess={handleSuccess} tag={selectedTags[0]} disabled={selectedTags.length !== 1} />
          <Box paddingLeft="0.5rem" />
          <ButtonCreateTag onSuccess={handleSuccess} />
        </Box>
      </AppHeader>

      <TagsTable
        onIsLoading={setIsLoading}
        onGridReady={setGridReadyEvent}
        onSelectionChanged={handleSelectionChanged}
        onDatasourceSuccess={handleDatasourceSuccess}
      />
    </AppLayout>
  );
};
