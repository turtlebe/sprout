import { Device } from '@plentyag/app-devices/src/common/types';
import { getShortenedPathFromObject } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/utils';
import { Chip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export interface AutocompleteOption {
  device: Device;
}

export const AutocompleteOption: React.FC<AutocompleteOption> = ({ device }) => {
  return (
    <>
      <Chip label={device.deviceTypeName} size="small" />
      &nbsp;
      {device.serial}
      &nbsp;
      {device?.location ? getShortenedPathFromObject(device?.location) : null}
    </>
  );
};
