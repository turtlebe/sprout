import { PATHS } from '@plentyag/app-environment/src/paths';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

import { CameraLastTriggeredAtItem } from './camera-last-triggered-at-item';

const dataTestIds = {
  table: 'detail-camera-info-view-table',
  header: 'detail-camera-info-view-table-header',
  row: (cameraId: string) => `detail-camera-info-view-table-row-${cameraId}`,
};

export { dataTestIds as dataTestIdDetailCameraInfoPage };
export interface CameraInfo {
  farm_def_id: string;
  location: string;
  serial: string;
  is_connected: boolean;
  model: string;
  last_triggered_at: string;
}
interface DetailCameraInfoPage {
  results: CameraInfo[];
}

export const DetailCameraInfoPage: React.FC<DetailCameraInfoPage> = ({ results }) => {
  return (
    <TableContainer data-testid={dataTestIds.table}>
      <Table size="small">
        <TableHead data-testid={dataTestIds.header}>
          <TableRow>
            <TableCell>FarmDef Id</TableCell>
            <TableCell>FarmDef Location</TableCell>
            <TableCell>Device Serial</TableCell>
            <TableCell>Device Model</TableCell>
            <TableCell>Is Connected</TableCell>
            <TableCell>Last Triggered At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results &&
            results.map(result => (
              <TableRow key={result.farm_def_id} data-testid={dataTestIds.row(result.farm_def_id)}>
                <Link to={PATHS.devicePage(result.farm_def_id)}>
                  <TableCell>{result.farm_def_id}</TableCell>
                </Link>
                <TableCell>{result.location}</TableCell>
                <TableCell>{result.serial}</TableCell>
                <TableCell>{result.model}</TableCell>
                <TableCell>{result.is_connected + ''}</TableCell>
                <TableCell>
                  {result.last_triggered_at || <CameraLastTriggeredAtItem locationPath={result.location} />}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
