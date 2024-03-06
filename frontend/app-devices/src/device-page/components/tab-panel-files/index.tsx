import { Device } from '@plentyag/app-devices/src/common/types';
import { DeviceDataType } from '@plentyag/app-devices/src/common/types/device-data-type';
import { Card, CardItem } from '@plentyag/brand-ui/src/components';
import { Grid } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DownloadUploadFileDevice } from '../download-upload-file-device';

export interface TabPanelFiles {
  device: Device;
}

interface DeviceFileConfig {
  name: string;
  dataType: DownloadUploadFileDevice['dataType'];
  allowedDeviceTypes: string[];
  disableUpload?: string[];
}

const sprinkles = ['Sprinkle', 'Sprinkle2Base', 'Sprinkle2FIR', 'Sprinkle2CO2'];
const cameras = [
  'BaslerACA308816gc',
  'BaslerACA402429uc',
  'BaslerACA54725gc',
  'BaslerACA40248gc',
  'BaslerA2A384013gc',
  'FramosD435e',
];

const FileCategories: DeviceFileConfig[] = [
  {
    name: 'Calibration File',
    dataType: DeviceDataType.config,
    allowedDeviceTypes: cameras,
    disableUpload: sprinkles,
  },
  {
    name: 'Factory Test Results',
    dataType: DeviceDataType.factoryTesting,
    allowedDeviceTypes: sprinkles,
  },
];

export const TabPanelFiles: React.FC<TabPanelFiles> = ({ device }) => {
  const allowedFilesForCurrentDevice = FileCategories.filter(fileCategory =>
    fileCategory.allowedDeviceTypes.includes(device.deviceTypeName)
  );

  return (
    allowedFilesForCurrentDevice.length > 0 && (
      <Grid item xs={6}>
        <Card title="Files" isLoading={false}>
          {allowedFilesForCurrentDevice.map(fileCategory => (
            <CardItem key={fileCategory.name} name={fileCategory.name}>
              <DownloadUploadFileDevice
                device={device}
                dataType={fileCategory.dataType}
                disableUpload={fileCategory.disableUpload?.includes(device.deviceTypeName)}
              />
            </CardItem>
          ))}
        </Card>
      </Grid>
    )
  );
};
