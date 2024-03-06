import { FDS_NAME } from '@plentyag/app-production/src/constants';
import { Show } from '@plentyag/brand-ui/src/components';
import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { ContainerData } from '../../types';
import { getResourceLoadedDate } from '../../utils/get-resource-loaded-date';

import { IrrigationTableDrawer } from './components/irrigation-table-drawer';

const { propLevel, propagation } = FDS_NAME;

const dataTestIds = getScopedDataTestIds(
  {
    irrigationButton: 'irrigation-button',
  },
  'irrigation-table-button'
);

export { dataTestIds as dataTestIdsViewIrrigationButton };

export interface IrrigationTableButton {
  data: ContainerData;
  parentWidth: number;
}

/**
 * This components renders a button that opens a drawer displaying the prop irrigation tasks.
 */
export const IrrigationTableButton: React.FC<IrrigationTableButton> = ({ data, parentWidth }) => {
  const containerLocation = data?.containerLocation;
  const containerLocationPath = containerLocation?.path;

  const lotName = data?.resourceState?.materialObj?.lotName;
  const area = getKindFromPath(containerLocationPath, 'areas');
  const machine = getKindFromPath(containerLocationPath, 'machines');
  const isPropLevel = machine?.startsWith(propLevel);
  const isPropTable = area === propagation && isPropLevel;
  const resourceLoadedDate = React.useMemo(() => getResourceLoadedDate(data), [data]);

  const [showIrrigation, setShowIrrigation] = React.useState(false);

  function handleOpenIrrigationDetails() {
    setShowIrrigation(true);
  }

  function onCloseIrrigation() {
    setShowIrrigation(false);
  }

  return (
    <Show when={Boolean(lotName && isPropTable && resourceLoadedDate)}>
      <Button
        data-testid={dataTestIds.irrigationButton}
        onClick={handleOpenIrrigationDetails}
        size="small"
        variant="outlined"
      >
        View Irrigation Details
      </Button>
      <IrrigationTableDrawer
        lotName={lotName}
        tableSerial={data?.resourceState?.containerObj?.serial}
        rackPath={containerLocationPath}
        tableLoadedDate={resourceLoadedDate}
        open={showIrrigation}
        onClose={onCloseIrrigation}
        rightOffSet={parentWidth}
      />
    </Show>
  );
};
