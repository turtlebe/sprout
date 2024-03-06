import { GetApp } from '@material-ui/icons';
import { Dropdown, DropdownItem, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { exportToCSV, exportToJson, getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { getCsvData, GetFilename, getFilename, getJsonData } from './utils';

const dataTestIds = getScopedDataTestIds(
  {
    csv: 'csv',
    json: 'json',
  },
  'downloadData'
);

export { dataTestIds as dataTestIdsDownloadData };

export interface DownloadData extends GetFilename {
  metrics: Metric[];
  observations: RolledUpByTimeObservation[][];
  disabled: boolean;
}

export const DownloadData: React.FC<DownloadData> = ({
  metrics,
  observations,
  disabled,
  schedule,
  dashboard,
  widgetName,
  startDateTime,
  endDateTime,
}) => {
  const filename = getFilename({ metrics, schedule, dashboard, widgetName, startDateTime, endDateTime });

  return (
    <Dropdown icon={GetApp} disabled={disabled} data-testid={dataTestIds.root}>
      <DropdownItem onClick={() => exportToCSV(filename, getCsvData(metrics, observations))}>
        <DropdownItemText>Download as CSV</DropdownItemText>
      </DropdownItem>
      <DropdownItem onClick={() => exportToJson(filename, getJsonData(metrics, observations))}>
        <DropdownItemText>Download as JSON</DropdownItemText>
      </DropdownItem>
    </Dropdown>
  );
};
