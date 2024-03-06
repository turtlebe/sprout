import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { Add, Eject, Place, Publish, SwapCalls, SystemUpdate } from '@material-ui/icons';
import {
  AppBreadcrumbs,
  AppHeader,
  AppLayout,
  ButtonCsvDownloadInfinite,
  Dropdown,
  DropdownItem,
  DropdownItemIcon,
  DropdownItemText,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { RedisJsonObject, useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Device, DeviceWorkflowInfo } from '../common/types';
import { allowedDeviceTypes, isDfuCompatible } from '../common/utils';
import { ROUTES } from '../routes';

import { DeviceTable } from './components/device-table';
import { useAgGridConfig } from './components/device-table/hooks';
import { DialogCsvIngest } from './components/dialog-csv-ingest';
import { useStyles } from './styles';

const dataTestIds = {
  actions: 'device-dashboard-page-actions',
  download: 'device-dashboard-page-download',
  csvIngest: 'device-dashboard-page-csv-ingest',
  replaceDevices: 'device-dashboard-page-replace-devices',
  commissionDevices: 'device-dashboard-page-commission-devices',
  upgradeFirmware: 'device-dashboard-page-upgrade-firmware',
  addDevice: 'device-dashboard-page-add-device',
};

export { dataTestIds as dataTestIdsDevicesPage };

export const DevicesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [deviceCount, setDeviceCount] = React.useState<number>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const {
    redisJsonObject,
    createRedisJsonObject,
    isLoading: isRedisJsonObjectLoading,
  } = useRedisJsonObjectApi<DeviceWorkflowInfo>();
  const [gridReadyEvent, setGridReadyEvent] = React.useState<GridReadyEvent>(null);
  const [isCsvIngestDialogOpen, setIsCsvIngestDialogOpen] = React.useState<boolean>(false);
  const classes = useStyles({});
  const snackbar = useGlobalSnackbar();
  const devicesAgGridCondig = useAgGridConfig();

  // Handlers

  const handleSelectionChanged: DeviceTable['onSelectionChanged'] = event => {
    const deviceIds: string[] = event.api.getSelectedRows().map((device: Device) => device.id);
    createRedisJsonObject({ value: { deviceIds } });
  };
  const handleCsvIngest = () => setIsCsvIngestDialogOpen(true);
  const handleUpgradeFirmware = (redisJsonObject: RedisJsonObject<DeviceWorkflowInfo>) => () => {
    const dfuCompatibleDevices = gridReadyEvent.api.getSelectedRows().filter(isDfuCompatible);
    if (dfuCompatibleDevices.length > 0) {
      history.push(ROUTES.upgradeFirmwarePage(redisJsonObject.id));
    } else {
      snackbar.warningSnackbar(
        'You must select at least one device compatible for Firmware Upgrade.' +
          ` Device Firmware Upgrade is only supported for ${allowedDeviceTypes.join(',')} devices.`
      );
    }
  };
  const handleDatasourceSuccess: DeviceTable['onDatasourceSuccess'] = result => {
    setDeviceCount(result.meta.total);
  };

  return (
    <AppLayout isLoading={isLoading || isRedisJsonObjectLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={ROUTES.devicesPage}
          homePageName={deviceCount ? `Devices (${deviceCount})` : 'Devices'}
        />
        <Box display="flex">
          <ButtonCsvDownloadInfinite
            gridReadyEvent={gridReadyEvent}
            agGridConfig={devicesAgGridCondig.config}
            fileNamePrefix="devices"
            serviceName="farm-def-service"
            operation="search-devices-by"
            data-testid={dataTestIds.download}
          />
          <Box padding={0.5} />
          <Button
            data-testid={dataTestIds.csvIngest}
            variant="contained"
            color="default"
            onClick={() => handleCsvIngest()}
            startIcon={<Publish />}
          >
            CSV/JSON Ingest
          </Button>
          <Box padding={0.5} />
          <Dropdown data-testid={dataTestIds.actions} variant="contained" color="default" label="Actions">
            <DropdownItem
              disabled={!redisJsonObject || isRedisJsonObjectLoading}
              component={Link}
              to={ROUTES.swapDevices(redisJsonObject?.id)}
              data-testid={dataTestIds.replaceDevices}
            >
              <DropdownItemIcon>
                <SwapCalls />
              </DropdownItemIcon>
              <DropdownItemText primary="Swap Devices" />
            </DropdownItem>
            <DropdownItem
              disabled={!redisJsonObject || isRedisJsonObjectLoading}
              component={Link}
              to={ROUTES.commissionDevices(redisJsonObject?.id)}
              data-testid={dataTestIds.commissionDevices}
            >
              <DropdownItemIcon>
                <Place />
              </DropdownItemIcon>
              <DropdownItemText primary="Commission Devices" />
            </DropdownItem>
            <DropdownItem
              disabled={!redisJsonObject || isRedisJsonObjectLoading}
              component={Link}
              to={ROUTES.decommissionDevices(redisJsonObject?.id)}
              data-testid={dataTestIds.commissionDevices}
            >
              <DropdownItemIcon>
                <Eject />
              </DropdownItemIcon>
              <DropdownItemText primary="Decommission Devices" />
            </DropdownItem>
            <DropdownItem
              disabled={!redisJsonObject || isRedisJsonObjectLoading}
              onClick={handleUpgradeFirmware(redisJsonObject)}
              data-testid={dataTestIds.upgradeFirmware}
            >
              <DropdownItemIcon>
                <SystemUpdate />
              </DropdownItemIcon>
              <DropdownItemText primary="Upgrade Firmware" />
            </DropdownItem>
          </Dropdown>
          <Box padding={0.5} />
          <Link to={ROUTES.deviceRegistrationPage} className={classes.link} data-testid={dataTestIds.addDevice}>
            <Button variant="contained" startIcon={<Add />}>
              Add Device
            </Button>
          </Link>
        </Box>
      </AppHeader>

      <DeviceTable
        onIsLoading={setIsLoading}
        onSelectionChanged={handleSelectionChanged}
        onGridReady={setGridReadyEvent}
        onDatasourceSuccess={handleDatasourceSuccess}
      />

      <DialogCsvIngest
        open={isCsvIngestDialogOpen}
        onClose={() => setIsCsvIngestDialogOpen(false)}
        onSuccess={() => setIsCsvIngestDialogOpen(false)}
      />
    </AppLayout>
  );
};
