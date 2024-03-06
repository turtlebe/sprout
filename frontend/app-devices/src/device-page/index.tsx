import { Device, DeviceWorkflowInfo, DmsDevice } from '@plentyag/app-devices/src/common/types';
import {
  isDfuCompatible,
  isHathorDevice,
  isSprinkle2Device,
  isSprinkleDevice,
} from '@plentyag/app-devices/src/common/utils';
import {
  AppBreadcrumbs,
  AppHeader,
  AppLayout,
  ButtonViewComments,
  CommentsWidget,
  DialogConfirmation,
  TabPanel,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { Box, Button, Chip, Grid, Tab, Tabs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { usePostRequest, useRedisJsonObjectApi, useSwrAxios } from '@plentyag/core/src/hooks';
import { CommentableType, ContextType } from '@plentyag/core/src/types';
import { getScopedDataTestIds, getShortenedPath, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  AutocompleteDevice,
  DeviceBatteryLevel,
  DeviceCertificate,
  DeviceFirmware,
  DeviceLastCommunication,
  DeviceLocationPath,
  DeviceState,
} from '../common/components';
import { ROUTES } from '../routes';

import {
  ButtonRebootDevice,
  DialogCommissionDevice,
  DropdownComeFindMe,
  DropdownTestSequences,
  TabPanelAssociatedDevices,
  TabPanelCalibrationHistory,
  TabPanelDeviceFaults,
  TabPanelFiles,
  TabPanelFirmwareHistory,
  TabPanelHathorConsoleLog,
} from './components';
import { useStyles } from './styles';
import { getAssociatedHathor, getDeviceSerial } from './utils';

export const getDeviceUrl = (deviceId: string) => `/api/plentyservice/device-management/get-device-by-id/${deviceId}`;
export const getDecommissionDeviceUrl = () => '/api/plentyservice/device-management/decommission-device';
export const getMappedDeviceLocationsUrl = (deviceId: String) =>
  `/api/plentyservice/farm-def-service/find-mapped-devices/${deviceId}`;

enum TabEnum {
  comments = 'comments',
  firmware = 'firmware',
  hathorConsoleLog = 'hathor-console-log',
  information = 'information',
}

const dataTestIds = getScopedDataTestIds(
  {
    backToDevices: 'back-to-devices',
    comeFindMe: 'come-find-me',
    commentsIcon: 'comments-icon',
    commentsTab: 'comments-tab',
    commentsTabPanel: 'comments-tab-pabel',
    commissionDevice: 'commission-device',
    decommissionDevice: 'decommission-device',
    deviceType: 'device-type',
    firmwareTab: 'firmware-tab',
    firmwareTabPanel: 'firmware-tab-pabel',
    hathorConsoleLogTab: 'hathor-console-log-tab',
    hathorConsoleLogTabPanel: 'hathor-console-log-tab-pabel',
    header: 'header',
    informationTab: 'information-tab',
    informationTabPanel: 'information-tab-pabel',
    location: 'location',
    macAddress: 'mac-address',
    rebootDevice: 'reboot-device',
    testSequences: 'test-sequences',
    upgradeFirmware: 'upgrade-firmware',
  },
  'DevicePage'
);

export { dataTestIds as dataTestIdsDevicePage };

interface DevicePageUrlParams {
  deviceId: string;
  tab?: string;
}

export const DevicePage: React.FC<RouteComponentProps<DevicePageUrlParams>> = ({ match, history }) => {
  const { deviceId, tab = TabEnum.information } = match.params;
  const [currentTab, setCurrentTab] = React.useState<TabEnum>(TabEnum[tab]);
  const [isDecommissionDeviceDialogOpen, setIsDecommissionDeviceDialogOpen] = React.useState<boolean>(false);
  const [isCommissionDeviceDialogOpen, setIsCommissionDeviceDialogOpen] = React.useState<boolean>(false);
  const snackbar = useGlobalSnackbar();
  const requests = {
    redisObject: useRedisJsonObjectApi<DeviceWorkflowInfo>(),
    getDevice: useSwrAxios<DmsDevice>({ url: getDeviceUrl(deviceId) }),
    decommissionDevice: usePostRequest<DmsDevice, { deviceId: string }>({ url: getDecommissionDeviceUrl() }),
    mappedDevices: useSwrAxios<Device[]>({
      url: getMappedDeviceLocationsUrl(deviceId),
    }),
  };

  const classes = useStyles();
  const device = requests.getDevice.data;
  const isLoading =
    requests.redisObject.isLoading ||
    requests.getDevice.isValidating ||
    requests.decommissionDevice.isLoading ||
    requests.mappedDevices.isValidating;
  const deviceSerial = getDeviceSerial(device);
  const associatedHathor = getAssociatedHathor(requests.mappedDevices.data);
  const isCommissioned = Boolean(device?.location);

  // Handlers
  function handleTabChange(event: React.ChangeEvent<{}>, value: any) {
    history.push(ROUTES.devicePageTab(deviceId, value));
    setCurrentTab(value);
  }

  function handleDecommissionDevice() {
    setIsDecommissionDeviceDialogOpen(false);

    void requests.decommissionDevice.makeRequest({
      data: { deviceId },
      onSuccess: () => {
        snackbar.successSnackbar('Device successfully decommissioned.');
        void requests.getDevice.revalidate();
      },
      onError: error => {
        snackbar.errorSnackbar({ message: parseErrorMessage(error) });
      },
    });
  }

  function handleUpgradeFirmware() {
    requests.redisObject.createRedisJsonObject({
      value: { deviceIds: [device.id] },
      onSuccess: redisJsonObject => {
        history.push(ROUTES.upgradeFirmwarePage(redisJsonObject?.id));
      },
    });
  }

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader paddingBottom={0} flexDirection="column">
        <AppBreadcrumbs homePageRoute={ROUTES.devicesPage} homePageName="Devices" pageName={deviceSerial} />
        <Box padding={1} />
        <AutocompleteDevice onChange={device => device && history.push(ROUTES.devicePage(device.id))} />

        <Box py={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5">
              <Box display="flex" alignItems="center" gridGap="0.5rem" data-testid={dataTestIds.header}>
                <div>Serial: {deviceSerial}</div>
                <DeviceState device={device} />
                <DeviceCertificate device={device} />
                <DeviceLastCommunication device={device} />
                <DeviceBatteryLevel device={device} />

                <ButtonViewComments
                  data-testid={dataTestIds.commentsIcon}
                  onClick={() => handleTabChange(null, TabEnum.comments)}
                  commentableId={device?.id}
                  commentableType={CommentableType.deviceId}
                />
              </Box>
            </Typography>
            <Typography variant="h6" color="textSecondary" data-testid={dataTestIds.deviceType}>
              Type: {device?.deviceTypeName ?? '--'}
            </Typography>
            <Typography variant="h6" color="textSecondary" data-testid={dataTestIds.location}>
              Location:&nbsp;
              {device?.location ? (
                <DeviceLocationPath display="inline-flex" width="unset" device={device} copyable />
              ) : (
                '--'
              )}
            </Typography>
            {isHathorDevice(device) && (
              <Typography variant="h6" color="textSecondary" data-testid={dataTestIds.macAddress}>
                MAC Address: {device?.properties?.macAddress ?? '--'}
              </Typography>
            )}
            <DeviceFirmware device={device} />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" gridGap="0.5rem">
            {isDfuCompatible(device) && (
              <Button variant="contained" onClick={handleUpgradeFirmware} data-testid={dataTestIds.upgradeFirmware}>
                Upgrade Firmware
              </Button>
            )}
            {isCommissioned ? (
              <Button
                variant="contained"
                onClick={() => setIsDecommissionDeviceDialogOpen(true)}
                data-testid={dataTestIds.decommissionDevice}
              >
                Decommission Device
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setIsCommissionDeviceDialogOpen(true)}
                data-testid={dataTestIds.commissionDevice}
              >
                Commission Device
              </Button>
            )}

            {isSprinkle2Device(device) && associatedHathor && (
              <DropdownComeFindMe
                device={device}
                associatedHathor={associatedHathor}
                data-testid={dataTestIds.comeFindMe}
              />
            )}
            {isHathorDevice(device) && device.hasCertificate && (
              <ButtonRebootDevice device={device} data-testid={dataTestIds.rebootDevice} />
            )}
            {isHathorDevice(device) && device.hasCertificate && (
              <DropdownTestSequences device={device} data-testid={dataTestIds.testSequences} />
            )}
          </Box>
        </Box>

        <Tabs className={classes.tabsContainer} value={currentTab} onChange={handleTabChange}>
          <Tab data-testid={dataTestIds.informationTab} value={TabEnum.information} wrapped label="Information" />
          <Tab data-testid={dataTestIds.commentsTab} value={TabEnum.comments} wrapped label="Comments" />
          <Tab data-testid={dataTestIds.firmwareTab} value={TabEnum.firmware} wrapped label="Firmware" />
          {isHathorDevice(device) && (
            <Tab
              data-testid={dataTestIds.hathorConsoleLogTab}
              value={TabEnum.hathorConsoleLog}
              wrapped
              label="Console Log"
            />
          )}
        </Tabs>
      </AppHeader>

      <Box padding={2}>
        <TabPanel value={currentTab} data-testid={dataTestIds.informationTabPanel} index={TabEnum.information}>
          {device && (isSprinkleDevice(device) || isSprinkle2Device(device)) && (
            <Grid container spacing={2}>
              <TabPanelCalibrationHistory device={device} />
            </Grid>
          )}
          {device && (
            <Grid container spacing={2}>
              <TabPanelFiles device={device} />
              <TabPanelAssociatedDevices
                devices={requests.mappedDevices.data}
                isLoading={requests.mappedDevices.isValidating}
              />
              {isHathorDevice(device) && <TabPanelDeviceFaults device={device} />}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={currentTab} data-testid={dataTestIds.commentsTabPanel} index={TabEnum.comments}>
          <Grid container spacing={2}>
            <Grid item md={12} lg={10} xl={6}>
              <CommentsWidget
                commentableId={device?.id}
                commentableType={CommentableType.deviceId}
                contextId={device?.location?.path}
                contextType={device?.location?.path ? ContextType.deviceLocationPath : undefined}
                renderContext={comment => <Chip label={getShortenedPath(comment.contextId)} />}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} data-testid={dataTestIds.firmwareTabPanel} index={TabEnum.firmware}>
          {device && (
            <Grid container spacing={2}>
              <TabPanelFirmwareHistory device={device} />
            </Grid>
          )}
        </TabPanel>
        <TabPanel
          value={currentTab}
          data-testid={dataTestIds.hathorConsoleLogTabPanel}
          index={TabEnum.hathorConsoleLog}
        >
          {device && (
            <Grid container spacing={2}>
              <TabPanelHathorConsoleLog device={device} />
            </Grid>
          )}
        </TabPanel>
      </Box>

      {device && (
        <DialogCommissionDevice
          device={device}
          open={isCommissionDeviceDialogOpen}
          onClose={() => setIsCommissionDeviceDialogOpen(false)}
          onSuccess={() => {
            setIsCommissionDeviceDialogOpen(false);
            void requests.getDevice.revalidate();
          }}
        />
      )}
      <DialogConfirmation
        open={isDecommissionDeviceDialogOpen}
        title="Are you sure you'd like to decommission this device?"
        confirmLabel="Decommission Device"
        onConfirm={handleDecommissionDevice}
        onCancel={() => setIsDecommissionDeviceDialogOpen(false)}
      />
    </AppLayout>
  );
};
