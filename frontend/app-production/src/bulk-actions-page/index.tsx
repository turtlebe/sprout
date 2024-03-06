import { Add, Clear } from '@material-ui/icons';
import { Operations } from '@plentyag/app-production/src/common/components';
import { AppHeader, AppLayout, RefreshButton } from '@plentyag/brand-ui/src/components';
import { Box, Button, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useQueryParam } from '@plentyag/core/src/hooks';
import { uniq } from 'lodash';
import React from 'react';

import {
  DialogActionResults,
  DialogAddContainerSerialNumbers,
  DialogPerformAction,
  TableBulkContainerSerials,
} from './components';
import { useGetContainersResourceState } from './hooks';
import { useStyles } from './styles';
import { Container, ContainerActionResult, SerialStatus } from './types';
import { getSerialStatus } from './utils';

const dataTestIds = {
  add: 'bulk-actions-add',
  remove: 'bulk-actions-remove',
  validSerials: 'bulk-actions-valid-serials',
  invalidSerials: 'bulk-actions-invalid-serials',
  refresh: 'bulk-actions-refresh',
};

export { dataTestIds as dataTestIdsBulkActionsPage };

type Dialogs = 'AddSerialNumbersDialog' | 'PerformActionDialog' | 'ShowResultsDialog';

export const BulkActionsPage: React.FC = () => {
  const serialsFromQueryParameters = useQueryParam().getAll('serials[]');

  const classes = useStyles();

  const [{ currentUser }] = useCoreStore();
  const currentSite = getKindFromPath(currentUser.currentFarmDefPath, 'sites');

  const [openDialog, setOpenDialog] = React.useState<Dialogs>(undefined);

  const [operation, setOperation] = React.useState<ProdActions.Operation>();

  const [containers, setContainers] = React.useState<Container[]>([]);
  const [containersActionResult, setContainersActionResult] = React.useState<ContainerActionResult[]>([]);

  const { fetch, isLoading } = useGetContainersResourceState();

  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<string>(new Date().toISOString());

  function handleAddSerials(newSerials: string[]) {
    // dedup and add new serials to end of existing list.
    const dedupedNewSerials = uniq(newSerials).filter(
      newSerial => !containers.some(resource => resource.serial === newSerial)
    );

    if (dedupedNewSerials.length === 0) {
      return;
    }

    function handleSuccess(result: ProdResources.ResourceState[]) {
      const newContainers = dedupedNewSerials.map<Container>(serial => {
        const resourceState = result.find(resource => resource.containerObj.serial === serial);
        return {
          isSelected: false,
          resourceState,
          serial,
          serialStatus: getSerialStatus(resourceState, currentSite),
        };
      });
      setContainers(containers.concat(newContainers));
    }

    fetch(dedupedNewSerials, handleSuccess);
  }

  React.useEffect(() => {
    if (serialsFromQueryParameters?.length > 0) {
      handleAddSerials(serialsFromQueryParameters);
    }
  }, []);

  function handleSerialChanged(oldSerial: string, newSerial: string) {
    function handleSuccess(result: ProdResources.ResourceState[]) {
      const hasResult = result.length === 1;
      const state = hasResult && result[0];
      const container = containers.find(container => container.serial === oldSerial);
      container.serial = newSerial;
      container.serialStatus = getSerialStatus(state, currentSite);
      container.resourceState = hasResult ? result[0] : null;
      setContainers(containers);
    }

    fetch([newSerial], handleSuccess);
  }

  function refreshContainersResourceState() {
    function handleSuccess(result: ProdResources.ResourceState[]) {
      const newContainers = containers.map<Container>(container => {
        const newResourceState = result.find(data => data.containerObj.serial === container.serial);
        return {
          isSelected: container.isSelected,
          resourceState: newResourceState,
          serial: container.serial,
          serialStatus: getSerialStatus(newResourceState, currentSite),
        };
      });
      setContainers(newContainers);
      setLastRefreshedAt(new Date().toISOString());
    }

    const serials = containers.map(container => container.serial);
    fetch(serials, handleSuccess);
  }

  function handleActionComplete(result: ContainerActionResult[]) {
    setContainersActionResult(result);
    setOpenDialog('ShowResultsDialog');
  }

  const selectedValidContainers = containers.filter(
    container => container.isSelected && container.serialStatus === SerialStatus.valid
  );

  const numSelected = containers.filter(container => container.isSelected).length;

  const areOperationsEnabled = numSelected !== 0 && numSelected === selectedValidContainers.length;

  const numValidSerials = containers.filter(container => container.serialStatus === SerialStatus.valid).length;

  const serials = selectedValidContainers.map(container => container.serial).join(', ');
  const prefilledArgsId = { id: { isDisabled: true, value: serials } };
  const prefilledArgsSerial = { serial: { isDisabled: true, value: serials } };
  const allowedOperations: ProdActions.AllowedOperation[] = [
    {
      name: 'TrashContainer',
      displayName: 'Trash',
      prefilledArgs: prefilledArgsSerial,
      bulkFieldName: 'serial',
    },
    {
      name: 'WashContainer',
      displayName: 'Wash',
      prefilledArgs: prefilledArgsSerial,
      bulkFieldName: 'serial',
    },
    {
      name: 'MoveContainer',
      displayName: 'Move',
      prefilledArgs: prefilledArgsSerial,
      bulkFieldName: 'serial',
    },
    {
      name: 'ScrapMaterial',
      displayName: 'Scrap',
      prefilledArgs: prefilledArgsSerial,
      bulkFieldName: 'serial',
    },
    {
      name: 'AddOrChangeCrop',
      displayName: 'Add Or Change Crop',
      prefilledArgs: prefilledArgsSerial,
      bulkFieldName: 'serial',
    },
    {
      name: 'AddLabelGeneral',
      displayName: 'Add Label',
      prefilledArgs: prefilledArgsId,
      bulkFieldName: 'id',
    },
    {
      name: 'RemoveContainerLabel',
      displayName: 'Remove Container Label',
      prefilledArgs: prefilledArgsId,
      bulkFieldName: 'id',
    },
    {
      name: 'RemoveMaterialLabel',
      displayName: 'Remove Material Label',
      prefilledArgs: prefilledArgsId,
      bulkFieldName: 'id',
    },
  ];

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader flexDirection="column">
        <Box display="flex" flexDirection="row" alignItems="center" marginBottom="1rem">
          <Box>
            <Typography variant="h5" style={{ marginLeft: 5 }}>
              Bulk Actions
            </Typography>
            <Box padding={0.5} />
            <Typography data-testid={dataTestIds.validSerials}>Number of Valid Serials: {numValidSerials}</Typography>
            <Typography data-testid={dataTestIds.invalidSerials}>
              Number of Invalid Serials: {containers.length - numValidSerials}
            </Typography>
            <Typography variant="caption">Note: Actions can only be performed on valid serials.</Typography>
          </Box>
          <Box display="flex" mx={1} flexWrap="wrap">
            <Button
              className={classes.headerButton}
              disabled={isLoading}
              data-testid={dataTestIds.add}
              variant="contained"
              startIcon={<Add />}
              color="default"
              onClick={() => setOpenDialog('AddSerialNumbersDialog')}
            >
              Serials
            </Button>
            <Button
              className={classes.headerButton}
              disabled={numSelected === 0}
              data-testid={dataTestIds.remove}
              variant="contained"
              startIcon={<Clear />}
              color="default"
              onClick={() => setContainers(containers.filter(container => !container.isSelected))}
            >
              Serials
            </Button>
          </Box>
          <Operations
            selectOperation={selectedOperation => {
              setOperation(selectedOperation);
              setOpenDialog('PerformActionDialog');
            }}
            siteName={currentSite}
            allowedOperations={allowedOperations}
            areOperationsEnabled={areOperationsEnabled}
          />
        </Box>
        <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={refreshContainersResourceState} />
      </AppHeader>

      {openDialog === 'AddSerialNumbersDialog' && (
        <DialogAddContainerSerialNumbers
          onAdd={serials => {
            setOpenDialog(undefined);
            handleAddSerials(serials);
          }}
          onCancel={() => {
            setOpenDialog(undefined);
          }}
        />
      )}
      {openDialog === 'PerformActionDialog' && (
        <DialogPerformAction
          operation={operation}
          containers={selectedValidContainers}
          onActionComplete={handleActionComplete}
          onClose={() => {
            setOpenDialog(undefined);
            setOperation(null);
          }}
        />
      )}
      {openDialog === 'ShowResultsDialog' && (
        <DialogActionResults
          action={operation}
          containers={containersActionResult}
          onClose={() => {
            setOpenDialog(undefined);
            refreshContainersResourceState();
          }}
        />
      )}
      <TableBulkContainerSerials
        containers={containers}
        onSerialChanged={handleSerialChanged}
        onSelectedSerialsChanged={(selectedSerials: string[]) => {
          setContainers(
            containers.map(container => {
              container.isSelected = selectedSerials.includes(container.serial);
              return container;
            })
          );
        }}
      />
    </AppLayout>
  );
};
