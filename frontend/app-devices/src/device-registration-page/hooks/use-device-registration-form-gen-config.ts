import { when } from '@plentyag/brand-ui/src/components/form-gen';
import { isChildDeviceLocation, isDeviceLocation } from '@plentyag/core/src/farm-def/type-guards';
import {
  getDeviceLocationRefFromChildDeviceLocationRef,
  isChildDeviceLocationRef,
} from '@plentyag/core/src/farm-def/utils';
import * as yup from 'yup';

interface UseDeviceRegistrationFormGenConfigReturn extends FormGen.Config {}

const SPRINKLE2_TYPENAMES = ['Sprinkle2Base', 'Sprinkle2FIR', 'Sprinkle2CO2'];

export const useDeviceRegistrationFormGenConfig = (): UseDeviceRegistrationFormGenConfigReturn => {
  return {
    title: 'Device Registration',
    createEndpoint: '/api/plentyservice/device-management/register-device',
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
        name: 'serial',
        label: 'Serial',
        validate: yup
          .string()
          .required()
          .matches(/^[a-zA-Z0-9]+([-:][a-zA-Z0-9]+)*$/, {
            message: 'Please enter a valid serial name (Alphanumerical, dash or colon allowed in between)',
          }),
      },
      {
        type: 'SelectRemote',
        name: 'typeName',
        label: 'Device Type',
        url: '/api/plentyservice/farm-def-service/search-device-types',
        transformResponse: data => (data ? data.map(deviceType => deviceType.name) : []),
        validate: yup.string().required(),
      },
      {
        if: when(['typeName'], typeName => SPRINKLE2_TYPENAMES.includes(typeName)),
        fields: [
          {
            type: 'TextField',
            name: 'deviceAddress',
            label: 'Device Address',
            validate: yup.string().required(),
          },
        ],
      },
      {
        computed: values => [
          {
            type: 'AutocompleteFarmDefObject',
            name: 'deviceLocationRef',
            label: 'Device Location',
            showDeviceLocations: true,
            deviceTypes: values.typeName ? [values.typeName] : [],
            closeWhenSelectingKinds: ['deviceLocation', 'childDeviceLocation'],
            validate: yup
              .string()
              .nullable()
              .matches(/^(.+)(:deviceLocation-)(.+)$/, 'Invalid selection, please select a device location'),
            onChange: farmDefObject =>
              isDeviceLocation(farmDefObject) || isChildDeviceLocation(farmDefObject) ? farmDefObject.ref : '',
            autocompleteProps: { disabled: !values.typeName },
          },
        ],
      },
    ],
  };
};
