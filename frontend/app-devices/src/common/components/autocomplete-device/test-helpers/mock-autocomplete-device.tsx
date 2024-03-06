import { Device } from '@plentyag/app-devices/src/common/types';
import React from 'react';

export const dataTestIds = {
  button: (device: Device) => `fake-autocomplete-device-${device.id}`,
};

export const mockAutocompleteDevice = (devices: Device[]) => ({
  AutocompleteDevice: jest.fn(props => {
    const handleClick = (device: Device) => () => {
      props.onChange(device);
    };
    return devices.map(device => (
      <button key={device.id} data-testid={dataTestIds.button(device)} onClick={handleClick(device)} />
    ));
  }),
});
