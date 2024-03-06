import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { BaseObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ButtonDeleteObservationDefinition, ObservationDefinitionsTable } from '../common/components';
import { PATHS } from '../paths';

import { ButtonCreateBaseObservationDefinition, ButtonEditBaseObservationDefinition } from './components';

/**
 * Page to CRUD BaseObservationDefinitions.
 */
export const BaseObservationDefinitionsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [definitionsCount, setDefinitionsCount] = React.useState<number>(null);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [selectedDefinitions, setSelectedDefinitions] = React.useState<BaseObservationDefinition[]>([]);

  const handleSuccess = () => {
    gridReadyEvent.api.refreshServerSideStore({ purge: true });
    gridReadyEvent.api.deselectAll();
  };
  const handleSelectionChanged: ObservationDefinitionsTable['onSelectionChanged'] = () => {
    setSelectedDefinitions(gridReadyEvent.api.getSelectedRows());
  };
  const handleDatasourceSuccess: ObservationDefinitionsTable['onDatasourceSuccess'] = result => {
    setDefinitionsCount(result.meta.total);
  };

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={PATHS.baseObservationDefinitionsPage}
          homePageName={
            definitionsCount ? `Base Observation Definitions (${definitionsCount})` : 'Base Observation Definitions'
          }
          marginLeft="0.75rem"
        />
        <Box display="flex">
          <ButtonDeleteObservationDefinition onSuccess={handleSuccess} definitions={selectedDefinitions} />
          <Box padding={0.5} />
          <ButtonEditBaseObservationDefinition
            definition={selectedDefinitions[0]}
            disabled={selectedDefinitions.length !== 1}
            onSuccess={handleSuccess}
          />
          <Box padding={0.5} />
          <ButtonCreateBaseObservationDefinition onSuccess={handleSuccess} />
        </Box>
      </AppHeader>

      <ObservationDefinitionsTable
        type="BaseObservationDefinition"
        onIsLoading={setIsLoading}
        onGridReady={setGridReadyEvent}
        onSelectionChanged={handleSelectionChanged}
        onDatasourceSuccess={handleDatasourceSuccess}
      />
    </AppLayout>
  );
};
