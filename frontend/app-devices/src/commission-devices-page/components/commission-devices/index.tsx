import { Done, DoneAll, Error as ErrorIcon } from '@material-ui/icons';
import { AutocompleteFarmDefObject, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
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
import { isChildDeviceLocation, isDeviceLocation } from '@plentyag/core/src/farm-def/type-guards';
import {
  getDeviceLocationPath,
  getDeviceLocationRefFromChildDeviceLocationRef,
  isChildDeviceLocationRef,
} from '@plentyag/core/src/farm-def/utils';
import { useGetRequest, usePostRequest } from '@plentyag/core/src/hooks';
import { toQueryParams } from '@plentyag/core/src/utils';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { map } from 'lodash';
import React from 'react';
import { useMap } from 'react-use';

import { StyledTableCell, TableCellDeviceTypeAndSerial, TableRowLoadingPlaceholder } from '../../../common/components';
import { Device } from '../../../common/types';

const ENTER_DELAY = 1000;

const dataTestIds = {
  tableBody: 'commission-devices-table-body',
  tableRow: (device: Device) => `commission-devices-table-row:${device.id}`,
  tableCellSerial: 'commission-devices-table-cell-serial',
  tableCellDeviceType: 'commission-devices-table-cell-device-type',
  tableCellDeviceLocation: 'commission-devices-table-cell-device-location',
  tableCellStatus: 'commission-devices-table-cell-status',
  statusLoading: 'commission-devices-table-cell-status-loading',
  statusAvailable: 'commission-devices-table-cell-status-available',
  statusUnavailable: 'commission-devices-table-cell-status-unavailable',
  statusComplete: 'commission-devices-table-cell-status-complete',
  commissionDevices: 'commission-devices-cta',
};

export { dataTestIds as dataTestIdsCommissionDevices };

export interface CommissionDevices {
  devices: Device[];
  isLoading: boolean;
}

const errors = {
  alreadySelected: 'Location already selected',
  alreadyTaken: 'Location already taken',
};

enum CommissionStatus {
  loading = 'LOADING',
  available = 'AVAILABLE',
  unavailable = 'UNAVAILABLE',
  commissioned = 'COMMISSIONNED',
}

export const CommissionDevices: React.FC<CommissionDevices> = ({ devices: propDevices = [], isLoading }) => {
  const snackbar = useGlobalSnackbar();
  const [devices, setDevices] = React.useState<Device[]>(propDevices);
  const requests = {
    searchDeviceByLocationRef: useGetRequest<Device>({}),
    commissionDevice: usePostRequest<
      Device,
      { deviceId: string; deviceLocationRef: string; childLocationRef?: string }
    >({
      url: '/api/plentyservice/device-management/commission-device',
      method: 'POST',
    }),
  };

  /**
   * Maps device ids to errors.
   *
   * Keys are the device id to be commissioned, values are strings representing error messages.
   */
  const [errorMap, { set: setErrorMap, remove: removeErrorMap }] = useMap<{
    [deviceId: string]: string;
  }>({});

  /**
   * Maps device ids to the status of the commissioning process.
   *
   * Keys are the device id to be commissioned, values are a status of DeviceLocationStatus
   */
  const [statusMap, { set: setStatusMap, remove: removeStatusMap }] = useMap<{ [deviceId: string]: CommissionStatus }>(
    {}
  );

  /**
   * Maps device ids to a device location ref.
   *
   * Keys are the device id to be commissioned, values are the device location ref selected to commission the device to.
   */
  const [deviceLocationRefMap, { set: setDeviceLocationRefMap, remove: removeDeviceLocationRefMap }] = useMap<{
    [deviceId: string]: string;
  }>({});

  /**
   * Maps device ids to a selected device location paths.
   *
   * Keys are the device id to be commissioned, values are the device location path selected to commission the device to.
   */
  const [deviceLocationPathMap, { set: setDeviceLocationPathMap }] = useMap<{
    [deviceId: string]: string;
  }>({});

  const handleChange =
    (device: Device): AutocompleteFarmDefObject['onChange'] =>
    object => {
      if (isDeviceLocation(object) || isChildDeviceLocation(object)) {
        setStatusMap(device.id, CommissionStatus.loading);
        removeErrorMap(device.id);

        if (Object.values(deviceLocationRefMap).includes(object.ref)) {
          setErrorMap(device.id, errors.alreadySelected);
          setStatusMap(device.id, CommissionStatus.unavailable);
          return;
        }

        requests.searchDeviceByLocationRef.makeRequest({
          url: `/api/plentyservice/farm-def-service/search-device-by-location${toQueryParams(
            isChildDeviceLocation(object)
              ? {
                  device_location_ref: getDeviceLocationRefFromChildDeviceLocationRef(object.ref),
                  child_device_location_ref: object.ref,
                }
              : {
                  device_location_ref: object.ref,
                }
          )}`,
          onSuccess: () => {
            setErrorMap(device.id, errors.alreadyTaken);
            setStatusMap(device.id, CommissionStatus.unavailable);
          },
          onError: error => {
            if (error.status === 404) {
              setStatusMap(device.id, CommissionStatus.available);
              setDeviceLocationRefMap(device.id, object.ref);
            } else {
              snackbar.errorSnackbar({ message: parseErrorMessage(error) });
              setErrorMap(device.id, parseErrorMessage(error));
              setStatusMap(device.id, CommissionStatus.unavailable);
            }
          },
        });
      } else {
        removeDeviceLocationRefMap(device.id);
        removeErrorMap(device.id);
        removeStatusMap(device.id);
      }
    };
  const handleCommissionDevices = () => {
    map(deviceLocationRefMap, (deviceLocationRef, deviceId) => {
      setStatusMap(deviceId, CommissionStatus.loading);
      requests.commissionDevice.makeRequest({
        data: isChildDeviceLocationRef(deviceLocationRef)
          ? {
              deviceId,
              deviceLocationRef: getDeviceLocationRefFromChildDeviceLocationRef(deviceLocationRef),
              childLocationRef: deviceLocationRef,
            }
          : { deviceId, deviceLocationRef },
        onSuccess: device => {
          setDeviceLocationPathMap(device.id, getDeviceLocationPath(device.location));
          removeDeviceLocationRefMap(device.id);
          setStatusMap(device.id, CommissionStatus.commissioned);
        },
        onError: error => {
          snackbar.errorSnackbar({ message: parseErrorMessage(error) });
          setStatusMap(deviceId, CommissionStatus.unavailable);
        },
      });
    });
  };

  React.useEffect(() => {
    propDevices && devices !== propDevices && setDevices(propDevices);
  }, [propDevices]);

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Device</StyledTableCell>
              <StyledTableCell align="left">Location</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid={dataTestIds.tableBody}>
            {devices.map(device => (
              <TableRow key={device.id} data-testid={dataTestIds.tableRow(device)}>
                <TableCellDeviceTypeAndSerial device={device} />
                <TableCell align="left" data-testid={dataTestIds.tableCellDeviceLocation}>
                  {statusMap[device.id] === CommissionStatus.commissioned || device.location ? (
                    getDeviceLocationPath(device.location) || deviceLocationPathMap[device.id]
                  ) : (
                    <AutocompleteFarmDefObject
                      showDeviceLocations={true}
                      deviceTypes={[device.deviceTypeName]}
                      onChange={handleChange(device)}
                      closeWhenSelectingKinds={['deviceLocation', 'childDeviceLocation']}
                      error={errorMap[device.id]}
                    />
                  )}
                </TableCell>
                <TableCell data-testid={dataTestIds.tableCellStatus}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {statusMap[device.id] === CommissionStatus.loading && (
                      <CircularProgress data-testid={dataTestIds.statusLoading} size="1rem" />
                    )}
                    {statusMap[device.id] === CommissionStatus.available && (
                      <>
                        <Typography>Ready&nbsp;</Typography>
                        <Done data-testid={dataTestIds.statusAvailable} color="action" />
                      </>
                    )}
                    {statusMap[device.id] === CommissionStatus.unavailable && (
                      <Tooltip title={errorMap[device.id] ?? ''} enterDelay={ENTER_DELAY}>
                        <ErrorIcon data-testid={dataTestIds.statusUnavailable} color="error" />
                      </Tooltip>
                    )}
                    {(statusMap[device.id] === CommissionStatus.commissioned || device.location) && (
                      <>
                        <Typography>Complete&nbsp;</Typography>
                        <DoneAll data-testid={dataTestIds.statusComplete} color="primary" />
                      </>
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
        onClick={handleCommissionDevices}
        data-testid={dataTestIds.commissionDevices}
        disabled={Object.keys(deviceLocationRefMap).length === 0}
      >
        Commission Devices ({Object.keys(deviceLocationRefMap).length})
      </Button>
    </Box>
  );
};
