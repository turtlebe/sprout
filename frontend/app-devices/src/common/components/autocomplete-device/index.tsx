import Autocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';
import { useGetRequest } from '@plentyag/core/src/hooks';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';
import { useDebounce } from 'react-use';

import { Device } from '../../types';

import { AutocompleteOption, AutocompleteTextField, dataTestIdsAutocompleteTextField } from './components';

type AutocompleteProps = MuiAutocompleteProps<Device, false, false, true>;

export const dataTestIdsAutocompleteDevice = {
  ...dataTestIdsAutocompleteTextField,
};

export interface AutocompleteDevice {
  onChange: (device: Device) => void;
  textFieldProps?: AutocompleteTextField['textFieldProps'];
  filterOptions?: AutocompleteProps['filterOptions'];
  error?: string;
}

export const AutocompleteDevice: React.FC<AutocompleteDevice> = ({
  onChange,
  filterOptions = options => options,
  textFieldProps,
  error,
}) => {
  const { current: id } = React.useRef(`autocomplete-device-${uuidv4()}`);
  const [selectedDevice, setSelectedDevice] = React.useState<Device>(null);
  const [inputValue, setInputValue] = React.useState<string>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { data: devices = [], isLoading, makeRequest } = useGetRequest<Device[]>({ url: '/api/devices' });

  const handleSelectDevice = (device: Device) => {
    setSelectedDevice(device);
    onChange(device);
  };
  const handleInputChange: AutocompleteProps['onInputChange'] = (event, value, reason) => {
    if (reason === 'input') {
      setInputValue(value);
    }
  };
  const handleChange: AutocompleteProps['onChange'] = (event, value) => {
    if (typeof value === 'string') {
      return;
    }
    handleSelectDevice(value);
  };
  const handleClose: AutocompleteProps['onClose'] = () => setIsOpen(false);
  const handleOpen: AutocompleteProps['onOpen'] = () => setIsOpen(true);

  useDebounce(
    () =>
      inputValue &&
      makeRequest({
        queryParams: { q: inputValue },
        onSuccess: response => {
          if (response.length === 1) {
            handleSelectDevice(response[0]);
          }
        },
      }),
    500,
    [inputValue]
  );

  return (
    <Autocomplete<Device, false, false, true>
      freeSolo
      autoHighlight
      getOptionLabel={device => device && device.id}
      id={id}
      filterOptions={filterOptions}
      loading={isLoading}
      onChange={handleChange}
      onClose={handleClose}
      onInputChange={handleInputChange}
      onOpen={handleOpen}
      open={devices.length > 1 && isOpen}
      options={devices}
      renderInput={params => (
        <AutocompleteTextField
          textFieldProps={textFieldProps}
          id={id}
          isLoading={isLoading}
          error={error}
          {...params}
        />
      )}
      renderOption={device => <AutocompleteOption device={device} />}
      value={selectedDevice}
    />
  );
};
