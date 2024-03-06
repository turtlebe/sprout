import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { DerivedObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ButtonDeleteObservationDefinition, ObservationDefinitionsTable } from '../common/components';
import { PATHS } from '../paths';

import { ButtonCreateDerivedObservationDefinition, ButtonEditDerivedObservationDefinition } from './components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsDerivedObservationDefinitionsPage };

/**
 * Page to CRUD DerivedObservationDefinitions.
 */
export const DerivedObservationDefinitionsPage: React.FC<RouteComponentProps> = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [definitionsCount, setDefinitionsCount] = React.useState<number>(null);
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [selectedDefinitions, setSelectedDefinitions] = React.useState<DerivedObservationDefinition[]>([]);

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
          homePageRoute={PATHS.derivedObservationDefinitionsPage}
          homePageName={
            definitionsCount
              ? `Derived Observation Definitions (${definitionsCount})`
              : 'Derived Observation Definitions'
          }
          marginLeft="0.75rem"
        />
        <Box display="flex">
          <ButtonDeleteObservationDefinition onSuccess={handleSuccess} definitions={selectedDefinitions} />
          <Box padding={0.5} />
          <ButtonEditDerivedObservationDefinition
            onSuccess={handleSuccess}
            definition={selectedDefinitions[0]}
            disabled={selectedDefinitions.length !== 1}
          />
          <Box padding={0.5} />
          <ButtonCreateDerivedObservationDefinition onSuccess={handleSuccess} />
        </Box>
      </AppHeader>

      <ObservationDefinitionsTable
        type="DerivedObservationDefinition"
        onIsLoading={setIsLoading}
        onGridReady={setGridReadyEvent}
        onSelectionChanged={handleSelectionChanged}
        onDatasourceSuccess={handleDatasourceSuccess}
      />
    </AppLayout>
  );
};
