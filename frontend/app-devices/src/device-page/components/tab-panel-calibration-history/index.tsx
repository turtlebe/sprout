import { CalibrationHistory, Device } from '@plentyag/app-devices/src/common/types';
import { Card } from '@plentyag/brand-ui/src/components/card';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { DateTimeFormat, getScopedDataTestIds } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { StyledTableCell, TableRowLoadingPlaceholder } from '../../../common/components';

function getCalibrationHistoryUrl(device: Device, type: string): string {
  return `/api/swagger/device-management-service/device-calibration-history-api/get-device-calibration-history/${device.id}?type=${type}`;
}

const dataTestIds = getScopedDataTestIds(
  {
    tableRow: (history: CalibrationHistory) => `row-${history.type}-${history.validFrom}`,
    cellType: 'cell-type',
    cellValidFrom: 'cell-valid-from',
    cellValidTo: 'cell-valid-to',
    cellCalibrationOffset: 'cell-offset',
    cellCalibrationFormula: 'cell-formulae',
    cellDevicePartNumber: 'cell-part-no',
    cellCalibrationError: 'cell-error',
    cellPreCalibrationError: 'cell-pre-error',
    cellPreCalibrationErrorUnits: 'cell-pre-error-units',
    cellPreCalibrationErrorValue: 'cell-pre-error-value',
    cellPreCalibrationErrorRefValue: 'cell-pre-error-ref-value',
    cellPostCalibrationError: 'cell-post-error',
    cellPostCalibrationErrorUnits: 'cell-post-error-units',
    cellPostCalibrationErrorValue: 'cell-post-error-value',
    cellPostCalibrationErrorRefValue: 'cell-post-error-ref-value',
  },
  'TabPanelCalibrationHistory'
);

export { dataTestIds as dataTestIdsTabPanelCalibrationHistory };

export interface TabPanelCalibrationHistory {
  device: Device;
}

export const TabPanelCalibrationHistory: React.FC<TabPanelCalibrationHistory> = ({ device }) => {
  const requests = {
    temperatureCalibrationHistory: useSwrAxios<CalibrationHistory[]>({
      url: getCalibrationHistoryUrl(device, 'TEMPERATURE'),
    }),

    humidityCalibrationHistory: useSwrAxios<CalibrationHistory[]>({
      url: getCalibrationHistoryUrl(device, 'RELATIVE_HUMIDITY'),
    }),

    co2CalibrationHistory: useSwrAxios<CalibrationHistory[]>({
      url: getCalibrationHistoryUrl(device, 'CONCENTRATION'),
    }),

    lightLevelCalibrationHistory: useSwrAxios<CalibrationHistory[]>({
      url: getCalibrationHistoryUrl(device, 'LIGHT_INTENSITY'),
    }),

    avgFirCalibrationHistory: useSwrAxios<CalibrationHistory[]>({
      url: getCalibrationHistoryUrl(device, 'AVERAGE_FIR'),
    }),

    pixelFirCalibrationHistory: useSwrAxios<CalibrationHistory[]>({
      url: getCalibrationHistoryUrl(device, 'PIXEL_FIR'),
    }),
  };

  const isValidating =
    requests.temperatureCalibrationHistory.isValidating ||
    requests.humidityCalibrationHistory.isValidating ||
    requests.co2CalibrationHistory.isValidating ||
    requests.lightLevelCalibrationHistory.isValidating ||
    requests.avgFirCalibrationHistory.isValidating ||
    requests.pixelFirCalibrationHistory.isValidating;

  const calibrationHistory: CalibrationHistory[] = [
    requests.temperatureCalibrationHistory.data,
    requests.humidityCalibrationHistory.data,
    requests.co2CalibrationHistory.data,
    requests.lightLevelCalibrationHistory.data,
    requests.avgFirCalibrationHistory.data,
    requests.pixelFirCalibrationHistory.data,
  ]
    .filter(Boolean)
    .flat();

  const error =
    requests.temperatureCalibrationHistory.error ||
    requests.humidityCalibrationHistory.error ||
    requests.co2CalibrationHistory.error ||
    requests.lightLevelCalibrationHistory.error ||
    requests.avgFirCalibrationHistory.error ||
    requests.pixelFirCalibrationHistory.error;

  useLogAxiosErrorInSnackbar(error);

  const round = num => num && Math.round((num + Number.EPSILON) * 100000) / 100000;

  return (
    <Grid item xs={12}>
      <Card title="Calibration Data" isLoading={false} doNotPadContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Type</StyledTableCell>
                <StyledTableCell align="left">Part Number</StyledTableCell>
                <StyledTableCell align="right">Valid From</StyledTableCell>
                <StyledTableCell align="right">Valid To</StyledTableCell>
                <StyledTableCell align="left">Offset</StyledTableCell>
                <StyledTableCell align="left">Formula</StyledTableCell>
                <StyledTableCell align="left">Error Pct.</StyledTableCell>
                <StyledTableCell align="left">Pre Calibration Error Pct.</StyledTableCell>
                <StyledTableCell align="left">Pre Calibration Error Units</StyledTableCell>
                <StyledTableCell align="left">Pre Calibration Error Value</StyledTableCell>
                <StyledTableCell align="left">Pre Calibration Error Ref Value</StyledTableCell>
                <StyledTableCell align="left">Post Calibration Error Pct.</StyledTableCell>
                <StyledTableCell align="left">Post Calibration Error Units</StyledTableCell>
                <StyledTableCell align="left">Post Calibration Error Value</StyledTableCell>
                <StyledTableCell align="left">Post Calibration Error Ref Value</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calibrationHistory.map(history => (
                <TableRow key={history.validFrom} data-testid={dataTestIds.tableRow(history)}>
                  <TableCell align="left" data-testid={dataTestIds.cellType}>
                    {history.type}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellDevicePartNumber}>
                    {history.devicePartNumber}
                  </TableCell>
                  <TableCell align="right" data-testid={dataTestIds.cellValidFrom}>
                    {DateTime.fromISO(history.validFrom).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS)}
                  </TableCell>
                  <TableCell align="right" data-testid={dataTestIds.cellValidTo}>
                    {DateTime.fromISO(history.validTo).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellCalibrationOffset}>
                    {round(history.calibrationOffset)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellCalibrationFormula}>
                    {history.calibrationFormula}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellCalibrationError}>
                    {round(history.calibrationError)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationError}>
                    {round(history.preCalibrationError)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationErrorUnits}>
                    {round(history.preCalibrationErrorUnits)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationErrorValue}>
                    {round(history.preCalibrationValue)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationErrorRefValue}>
                    {round(history.preCalibrationRefValue)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationError}>
                    {round(history.postCalibrationError)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationErrorUnits}>
                    {round(history.postCalibrationErrorUnits)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationErrorValue}>
                    {round(history.postCalibrationValue)}
                  </TableCell>
                  <TableCell align="left" data-testid={dataTestIds.cellPreCalibrationErrorRefValue}>
                    {round(history.postCalibrationRefValue)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRowLoadingPlaceholder
                colSpan={3}
                isLoading={isValidating}
                collection={calibrationHistory}
                text="No Calibration Data"
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  );
};
