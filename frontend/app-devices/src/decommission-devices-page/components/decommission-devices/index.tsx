import {
  dataTestIdsTableRowLoadingPlaceholder,
  StyledTableCell,
  TableCellDeviceTypeAndSerial,
  TableRowLoadingPlaceholder,
} from '@plentyag/app-devices/src/common/components';
import { Device } from '@plentyag/app-devices/src/common/types';
import {
  dataTestIdsDialogConfirmation,
  DialogConfirmation,
  Show,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getDeviceLocationPath } from '@plentyag/core/src/farm-def/utils';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';

const dataTestIds = {
  tableBody: 'decommission-devices-table-body',
  tableRow: (device: Device) => `decommission-devices-table-row:${device.id}`,
  tableRowDecommissioned: (device: Device) => `decommission-devices-table-row-decommissioned:${device.id}`,
  tableCellDeviceLocation: 'decommission-devices-table-cell-device-location',
  decommissionDevices: 'decommission-devices-cta',
  decommissionedTable: 'decommission-devices-table',
  placeholder: dataTestIdsTableRowLoadingPlaceholder,
  dialog: dataTestIdsDialogConfirmation,
};

export { dataTestIds as dataTestIdsDecommissionDevices };

export interface DecommissionDevices {
  devices: Device[];
  onIsDecommissioning: (isDecommissioning: boolean) => void;
  onDecommissioned: () => void;
}

/**
 * Component that displays devices in a Commissioned or Decommissioned Table.
 *
 * Commissioned devices, can be decommissioned when clicking on the main CTA.
 */
export const DecommissionDevices: React.FC<DecommissionDevices> = ({
  devices = [],
  onIsDecommissioning,
  onDecommissioned,
}) => {
  const snackbar = useGlobalSnackbar();
  const [isDecommissioning, setIsDecommissioning] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const commissionedDevices = devices.filter(device => getDeviceLocationPath(device.location));
  const decommissionedDevices = devices.filter(device => !getDeviceLocationPath(device.location));

  const handleDecommissionDevices = () => {
    setIsOpen(false);
    setIsDecommissioning(true);

    void Promise.all(
      commissionedDevices.map(async device =>
        axiosRequest({
          method: 'POST',
          data: { deviceId: device.id },
          url: '/api/plentyservice/device-management/decommission-device',
        })
      )
    )
      .then(() => snackbar.successSnackbar('Device(s) successfully decommissioned.'))
      .catch(error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ message });
      })
      .finally(() => {
        setIsDecommissioning(false);
        onDecommissioned();
      });
  };

  React.useEffect(() => {
    onIsDecommissioning(isDecommissioning);
  }, [isDecommissioning, onIsDecommissioning]);

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Device</StyledTableCell>
              <StyledTableCell align="left">Location</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissionedDevices.map(device => (
              <TableRow key={device.id} data-testid={dataTestIds.tableRow(device)}>
                <TableCellDeviceTypeAndSerial device={device} />
                <TableCell align="left" data-testid={dataTestIds.tableCellDeviceLocation}>
                  {getDeviceLocationPath(device.location)}
                </TableCell>
              </TableRow>
            ))}
            <TableRowLoadingPlaceholder
              collection={commissionedDevices}
              isLoading={false}
              text="All commissioned devices have been decommissioned."
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Box padding={1} />
      <Button
        variant="contained"
        onClick={() => setIsOpen(true)}
        data-testid={dataTestIds.decommissionDevices}
        disabled={commissionedDevices.length === 0 || isDecommissioning}
      >
        Decommission Devices ({commissionedDevices.length})
      </Button>
      <DialogConfirmation
        open={isOpen}
        title="Are you sure you'd like to decommission this devices?"
        confirmLabel="Decommission Device(s)"
        onConfirm={handleDecommissionDevices}
        onCancel={() => setIsOpen(false)}
      />
      <Show when={decommissionedDevices.length > 0}>
        <Box padding={1} />
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Decommissioned Device</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody data-testid={dataTestIds.decommissionedTable}>
              {decommissionedDevices.map(device => (
                <TableRow key={device.id} data-testid={dataTestIds.tableRowDecommissioned(device)}>
                  <TableCellDeviceTypeAndSerial device={device} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Show>
    </Box>
  );
};
