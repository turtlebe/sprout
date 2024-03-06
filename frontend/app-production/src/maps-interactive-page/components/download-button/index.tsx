import { GetApp } from '@material-ui/icons';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { IconButton, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefLine, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { exportToCSV, getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useQueryParameter } from '../../hooks/use-query-parameter';
import { filterMapsState } from '../../utils/filter-maps-state';
import { getCSVFromMapsState } from '../../utils/get-csv-from-maps-state';

const dataTestIds = getScopedDataTestIds({}, 'downloadButton');

export { dataTestIds as dataTestIdsDownloadButton };

export interface DownloadButton {
  mapsState: MapsState;
  machines?: FarmDefMachine[];
  isLoadingMachines: boolean;
  line?: FarmDefLine;
}

export const DownloadButton: React.FC<DownloadButton> = ({ mapsState, machines, isLoadingMachines, line }) => {
  const { parameters } = useQueryParameter();

  const linePath = line?.path;
  const isDisabled = isLoadingMachines || !linePath || !machines;

  function handleDownload() {
    const filteredMapsState = filterMapsState({ mapsState, queryParameters: parameters });
    const fileName = `${linePath.replaceAll('/', '_')}_maps_data_${parameters.selectedDate}.csv`;
    exportToCSV(fileName, getCSVFromMapsState(machines, filteredMapsState, parameters.selectedDate));
  }

  return (
    <Tooltip arrow title={<Typography>Download Map as CSV</Typography>}>
      <span>
        <IconButton
          data-testid={dataTestIds.root}
          disabled={isDisabled}
          color="primary"
          icon={GetApp}
          size="small"
          onClick={handleDownload}
        />
      </span>
    </Tooltip>
  );
};
