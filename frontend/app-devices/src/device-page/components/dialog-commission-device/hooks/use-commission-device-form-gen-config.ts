import { Device } from '@plentyag/app-devices/src/common/types';
import { isChildDeviceLocation, isDeviceLocation } from '@plentyag/core/src/farm-def/type-guards';
import {
  getDeviceLocationRefFromChildDeviceLocationRef,
  isChildDeviceLocationRef,
} from '@plentyag/core/src/farm-def/utils';
import * as yup from 'yup';

export interface UseCommissionDeviceFormGenConfig {
  device: Device;
}

export interface UseCommissionDeviceFormGenConfigReturn extends FormGen.Config {}

export const useCommissionDeviceFormGenConfig = ({
  device,
}: UseCommissionDeviceFormGenConfig): UseCommissionDeviceFormGenConfigReturn => {
  return {
    title: 'Commission Device',
    createEndpoint: '/api/plentyservice/device-management/commission-device',
    serialize: values => {
      const { deviceLocationRef } = values;

      if (isChildDeviceLocationRef(deviceLocationRef)) {
        return {
          ...values,
          deviceLocationRef: getDeviceLocationRefFromChildDeviceLocationRef(deviceLocationRef),
          childLocationRef: deviceLocationRef,
        };
      }

      return values;
    },
    fields: [
      {
        type: 'TextField',
        name: 'deviceId',
        label: 'Device ID',
        textFieldProps: { disabled: true },
        default: device.id,
      },
      {
        type: 'AutocompleteFarmDefObject',
        name: 'deviceLocationRef',
        label: 'Device Location',
        showDeviceLocations: true,
        closeWhenSelectingKinds: ['deviceLocation', 'childDeviceLocation'],
        deviceTypes: [device.deviceTypeName],
        onChange: object => (isDeviceLocation(object) || isChildDeviceLocation(object) ? object.ref : ''),
        validate: yup
          .string()
          .required()
          .matches(/^(.+)(:deviceLocation-)(.+)$/, 'Invalid selection, please select a device location'),
      },
    ],
  };
};
