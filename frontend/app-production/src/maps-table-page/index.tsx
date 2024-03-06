import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { GetApp } from '@material-ui/icons';
import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { AutocompleteFarmDefObject } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object';
import { getFarmDefPath } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/utils';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import {
  RefreshButton,
  dataTestids as refreshButtonDataTestIds,
} from '@plentyag/brand-ui/src/components/refresh-button';
import { Box, Button, LinearProgress, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { usePrevious } from 'react-use';

import { useAgGridConfig, useGetAllowedPaths, useLoadMapTable } from './hooks';
import { useStyles } from './styles';

export const dataTestIds = {
  downloadButton: 'download-button',
  loadButton: 'load-button',
  refreshButton: refreshButtonDataTestIds.button,
};
interface MapsTableUrlParams {
  site: string;
  area: string;
  line: string;
}

export const MapsTable: React.FC<RouteComponentProps<MapsTableUrlParams>> = ({ match }) => {
  const { site = '', area = '', line = '' } = match.params;
  const farmDefPathFromQueryParams = getFarmDefPath([site, area, line].join('/'));

  const { basePath, resourcesPageBasePath } = useAppPaths();

  function getViewPath(farmDefPath: string) {
    const mapsTableBasePath = `${basePath}/maps/table`;
    return farmDefPath ? `${mapsTableBasePath}/${farmDefPath}` : mapsTableBasePath;
  }

  const [selectedFarmDefObjectPath, setSelectedFarmDefObjPath] = React.useState<string>(farmDefPathFromQueryParams);
  const previousSelectedFarmDefObject = usePrevious(selectedFarmDefObjectPath);

  const history = useHistory();

  const { allowedPaths, initialPath } = useGetAllowedPaths(selectedFarmDefObjectPath);

  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);

  const { loadData, clearData, mapTable, isLoading } = useLoadMapTable(initialPath);
  const agGridConfig = useAgGridConfig(mapTable, resourcesPageBasePath);
  const classes = useStyles({ isLoading });

  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>();

  React.useEffect(() => {
    if (mapTable.length > 0) {
      setLastRefreshedAt(new Date().toISOString());
    }
  }, [mapTable]);

  React.useEffect(() => {
    if (selectedFarmDefObjectPath !== previousSelectedFarmDefObject) {
      clearData();
    }
  }, [selectedFarmDefObjectPath, previousSelectedFarmDefObject]);

  function handleFetchData() {
    loadData(selectedFarmDefObjectPath);
    const path = getViewPath(selectedFarmDefObjectPath);
    if (history.location.pathname !== path) {
      history.push(`${path}${history.location.search}`);
    }
  }

  const selectedSiteAndArea =
    selectedFarmDefObjectPath &&
    selectedFarmDefObjectPath.includes('sites/') &&
    selectedFarmDefObjectPath.includes('areas/');

  return (
    <Box className={classes.container}>
      <LinearProgress className={classes.linearProgress} />
      <Box mx={3} my={1} display="flex" justifyContent="space-between">
        <Typography variant="h4">Map Table</Typography>
        <Button
          data-testid={dataTestIds.downloadButton}
          startIcon={<GetApp />}
          variant="contained"
          color="default"
          disabled={mapTable.length === 0 || isLoading}
          onClick={() => handleAgGridCsvDownload({ gridReadyEvent, fileNamePrefix: 'maps-table' })}
        >
          Download
        </Button>
      </Box>
      <Box display="flex">
        <Box mx={3} my={1} maxWidth="25%" minWidth="350px">
          <AutocompleteFarmDefObject
            allowedPaths={allowedPaths}
            disabled={isLoading}
            closeWhenSelectingKinds={['line']}
            label="To view map table select: site/area/line"
            initialPath={initialPath}
            onChange={obj => setSelectedFarmDefObjPath(obj?.path || '')}
            error={!selectedSiteAndArea && 'Must enter at least Site and Area'}
          />
        </Box>
        {selectedSiteAndArea && mapTable.length > 0 && !isLoading && (
          <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={handleFetchData} />
        )}
        {selectedSiteAndArea && mapTable.length === 0 && (
          <Button
            data-testid={dataTestIds.loadButton}
            disabled={isLoading}
            style={{ alignSelf: 'center' }}
            variant="contained"
            onClick={handleFetchData}
          >
            Load
          </Button>
        )}
      </Box>
      <BaseAgGridClientSideTable agGridConfig={agGridConfig} onGridReady={setGridReadyEvent} />
    </Box>
  );
};
