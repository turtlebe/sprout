import { Done, DoneAll, Error as ErrorIcon } from '@material-ui/icons';
import { AutocompleteDevice } from '@plentyag/app-devices/src/common/components/autocomplete-device';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { map } from 'lodash';
import React from 'react';
import { useMap } from 'react-use';

import {
  DeviceTypeAndSerial,
  StyledTableCell,
  TableCellDeviceTypeAndSerial,
  TableRowLoadingPlaceholder,
} from '../../../common/components';
import { Device } from '../../../common/types';
import { DecommissionedDevice } from '../decommissioned-device';

export function filterOptions(devices: Device[], compatibleWithDevice: Device): Device[] {
  return devices.filter(device => device.deviceTypeName === compatibleWithDevice.deviceTypeName && !device.location);
}

const ENTER_DELAY = 1000;

const dataTestIds = {
  tableBody: 'swap-devices-table-body',
  tableRow: (device: Device) => `swap-devices-table-row:${device.id}`,
  tableCellDevice: 'swap-devices-table-cell-device',
  tableCellNewDevice: 'swap-devices-table-cell-new-device',
  tableCellSwapStatus: 'swap-devices-table-cell-swap-status',
  swapDevices: 'swap-devices-cta',
  swapStatusLoading: 'swap-devices-table-cell-swap-status-loading',
  swapStatusNewDeviceSelected: 'swap-devices-table-cell-swap-status-device-selected',
  swapStatusSwapped: 'swap-devices-table-cell-swap-status-done',
  swapStatusError: 'swap-devices-table-cell-swap-status-error',
};

export { dataTestIds as dataTestIdsSwapDevices };

enum DeviceSwapStatus {
  newDeviceSelected = 'NEW_DEVICE_SELECTED',
  loading = 'LOADING',
  swapped = 'SWAPPED',
  error = 'ERROR',
}

export interface SwapDevices {
  devices: Device[];
  isLoading: boolean;
}

export const SwapDevices: React.FC<SwapDevices> = ({ devices, isLoading }) => {
  const { makeRequest } = usePostRequest({ url: '/api/plentyservice/device-management/replace-device' });

  /**
   * Map of the devices to swap.
   *
   * Keys are the "original" device id to be swapped, values are the "new" device replacing the original device.
   */
  const [swapDeviceMap, { set: setSwapDeviceMap, remove: removeSwapDeviceMap }] = useMap<{
    [deviceId: string]: Device;
  }>({});

  /**
   * Map of the status of the swap.
   *
   * Keys are the "original" device id to be swapped, values are a status a DeviceSwapStatus.
   */
  const [swapStatusMap, { set: swetSwapStatusMap, remove: removeSwapStatusMap }] = useMap<{
    [deviceId: string]: DeviceSwapStatus;
  }>({});

  /**
   * Map of errors.
   *
   * Keys are the "original" device id to be swapped, values are strings representing error messages.
   */
  const [swapErrorMap, { set: setSwapErrorMap, remove: removeSwapErrorMap }] = useMap<{
    [deviceId: string]: string;
  }>({});

  /**
   * Map tracking the devices that have been swapped.
   *
   * Keys are the "original" device id that was swapped, values are the "new" device id that swapped the original device.
   */
  const [swappedDeviceMap, { set: setSwappedDeviceMap }] = useMap<{ [deviceId: string]: Device }>({});

  const handleDeviceSelected = (device: Device, newDevice: Device) => {
    removeSwapErrorMap(device.id);

    if (!newDevice) {
      removeSwapDeviceMap(device.id);
      removeSwapStatusMap(device.id);
      return;
    }
    if (newDevice.location) {
      setSwapErrorMap(device.id, 'Device is already commissioned');
      swetSwapStatusMap(device.id, DeviceSwapStatus.error);
    } else {
      setSwapDeviceMap(device.id, newDevice);
      swetSwapStatusMap(device.id, DeviceSwapStatus.newDeviceSelected);
    }
  };
  const handleReplaceDevices = () => {
    map(swapDeviceMap, (newDevice, deviceId) => {
      swetSwapStatusMap(deviceId, DeviceSwapStatus.loading);
      removeSwapErrorMap(deviceId);

      makeRequest({
        data: {
          deviceId,
          newDeviceId: newDevice.id,
        },
        onSuccess: () => {
          removeSwapDeviceMap(deviceId);
          setSwappedDeviceMap(deviceId, newDevice);
          swetSwapStatusMap(deviceId, DeviceSwapStatus.swapped);
        },
        onError: error => {
          setSwapErrorMap(deviceId, parseErrorMessage(error));
          swetSwapStatusMap(deviceId, DeviceSwapStatus.error);
          console.error(error);
        },
      });
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Device</StyledTableCell>
              <StyledTableCell align="left">New Device</StyledTableCell>
              <StyledTableCell align="right">Swap Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid={dataTestIds.tableBody}>
            {devices.map(device => (
              <TableRow key={device.id} data-testid={dataTestIds.tableRow(device)}>
                <TableCellDeviceTypeAndSerial device={device} withLocation data-testid={dataTestIds.tableCellDevice} />
                <TableCell align="left" data-testid={dataTestIds.tableCellNewDevice}>
                  {swappedDeviceMap[device.id] ? (
                    <DeviceTypeAndSerial device={swappedDeviceMap[device.id]} />
                  ) : device.location ? (
                    <AutocompleteDevice
                      onChange={newDevice => handleDeviceSelected(device, newDevice)}
                      filterOptions={options => filterOptions(options, device)}
                      textFieldProps={{ size: 'small', placeholder: 'Enter Device Serial' }}
                      error={swapErrorMap[device.id]}
                    />
                  ) : (
                    <DecommissionedDevice />
                  )}
                </TableCell>
                <TableCell data-testid={dataTestIds.tableCellSwapStatus}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {swapStatusMap[device.id] === DeviceSwapStatus.loading && (
                      <CircularProgress data-testid={dataTestIds.swapStatusLoading} size="1rem" />
                    )}
                    {swapStatusMap[device.id] === DeviceSwapStatus.newDeviceSelected && (
                      <>
                        <Typography>Ready&nbsp;</Typography>
                        <Done data-testid={dataTestIds.swapStatusNewDeviceSelected} color="action" />
                      </>
                    )}
                    {swapStatusMap[device.id] === DeviceSwapStatus.swapped && (
                      <>
                        <Typography>Complete&nbsp;</Typography>
                        <DoneAll data-testid={dataTestIds.swapStatusSwapped} color="primary" />
                      </>
                    )}
                    {swapStatusMap[device.id] === DeviceSwapStatus.error && (
                      <Tooltip title={swapErrorMap[device.id] ?? ''} enterDelay={ENTER_DELAY}>
                        <ErrorIcon data-testid={dataTestIds.swapStatusError} color="error" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            <TableRowLoadingPlaceholder collection={devices} isLoading={isLoading} />
          </TableBody>
        </Table>
      </TableContainer>
      <Box padding={1} />
      <Button
        variant="contained"
        onClick={handleReplaceDevices}
        disabled={Object.keys(swapDeviceMap).length === 0}
        data-testid={dataTestIds.swapDevices}
      >
        Swap Devices ({Object.keys(swapDeviceMap).length})
      </Button>
    </Box>
  );
};
