import { Device } from '@plentyag/app-devices/src/common/types';
import { omit } from 'lodash';
import * as yup from 'yup';

export interface UseUpgradeFirmwareFormGenConfig {
  deviceType: string;
  devices: Device[];
}

export interface UseUpgradeFirmwareFormGenConfigReturn extends FormGen.Config {}

export const useUpgradeFirmwareFormGenConfig = ({
  devices,
  deviceType,
}: UseUpgradeFirmwareFormGenConfig): UseUpgradeFirmwareFormGenConfigReturn => {
  return {
    title: `Upgrade ${deviceType} Firwmare`,
    serialize: (values = {}) => ({
      ...omit(values, ['firmwareInfo', 'deviceIds']),
      deviceIds: values.deviceIds.split(',').map(id => id.trim()),
      firmwareVersion: values.firmwareInfo.firmwareVersion,
      binaryType: values.firmwareInfo.binaryType,
    }),
    createEndpoint: '/api/plentyservice/executive-service/upgrade-firmware',
    fields: [
      {
        type: 'TextField',
        name: 'deviceIds',
        label: 'Devices',
        default: devices.map(device => device.id).join(', '),
        textFieldProps: { disabled: true },
        validate: yup.string().required(),
      },
      {
        type: 'TextField',
        name: 'deviceType',
        label: 'Device Type',
        default: deviceType,
        textFieldProps: { disabled: true },
        validate: yup.string().required(),
      },
      {
        type: 'AutocompleteFirmwareVersion',
        name: 'firmwareInfo',
        label: 'Firmware Version',
        deviceType,
        validate: yup.mixed().required(),
      },
    ],
  };
};
