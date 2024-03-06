import { Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { FirmwareVersion } from '@plentyag/core/src/types/firmware-version';
import { sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const SEARCH_DEVICE_FIRMWARE = '/api/plentyservice/device-management/search-firmware-images';

type TransformFirmwareVersions = FormGen.FieldAutocompleteRemote<FirmwareVersion[]>['transformResponse'];

interface TransformFirmwareVersionsOption {
  deviceType?: string;
}

export const transformFirmwareVersions =
  (options?: TransformFirmwareVersionsOption): TransformFirmwareVersions =>
  response => {
    const { deviceType } = options ?? {};

    const autocompleteOptions = response
      .filter(firmwareVersion => (deviceType ? firmwareVersion.deviceTypes.includes(deviceType) : true))
      .map(firmwareVersion => ({
        label: `${firmwareVersion.binaryType} - ${firmwareVersion.firmwareVersion}`,
        value: {
          firmwareVersion: firmwareVersion.firmwareVersion,
          binaryType: firmwareVersion.binaryType,
        },
      }));
    return sortBy(autocompleteOptions, ['label']);
  };

export const AutocompleteFirmwareVersion = memoWithFormikProps<FormGen.FieldAutocompleteFirmwareVersion>(
  ({ formGenField, formikProps, ...props }) => {
    const { deviceType, autocompleteProps, ...otherFormGenFieldProps } = formGenField;
    const transformResponse = transformFirmwareVersions({ deviceType });

    const formGenFieldAutocomplete: FormGen.FieldAutocompleteRemote<FirmwareVersion[]> = {
      ...otherFormGenFieldProps,
      type: 'AutocompleteRemote',
      url: SEARCH_DEVICE_FIRMWARE,
      autocompleteProps: {
        ...autocompleteProps,
        renderOption: valueLabel => {
          return (
            <>
              <Chip size="small" label={valueLabel.value.binaryType} />
              &nbsp;
              {valueLabel.value.firmwareVersion}
            </>
          );
        },
      },
      transformResponse,
    };

    return <AutocompleteRemote formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
