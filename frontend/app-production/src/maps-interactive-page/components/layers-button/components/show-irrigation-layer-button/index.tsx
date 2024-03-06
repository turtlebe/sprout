import { ReactComponent as IrrigationIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-icon.svg';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import React from 'react';

import { LayersButtonItem } from '../layers-button-item';

const dataTestIds = {
  switch: 'show-irrigation-layer-switch',
};

export { dataTestIds as dataTestIdsShowIrrigationLayerButton };

export const ShowIrrigationLayerButton: React.FC = () => {
  const { parameters, setParameters } = useQueryParameter();

  const handleShowIrrigationLayerChange = () => {
    setParameters({ showIrrigationLayer: !parameters.showIrrigationLayer });
  };

  return (
    <LayersButtonItem
      icon={<IrrigationIcon height="1.25rem" width="1.25rem" />}
      title="Irrigation"
      isChecked={parameters.showIrrigationLayer}
      handleToggle={handleShowIrrigationLayerChange}
      switchDataTestId={dataTestIds.switch}
    />
  );
};
