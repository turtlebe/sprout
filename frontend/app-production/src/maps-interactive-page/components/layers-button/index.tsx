import { Layers } from '@material-ui/icons';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PopoverButton } from '../popover-button';

import { ShowCommentsLayerButton } from './components/show-comments-layer-button';
import { ShowIrrigationLayerButton } from './components/show-irrigation-layer-button';
import { ShowSerialsLayerButton } from './components/show-serials-layer-button';

const dataTestIds = getScopedDataTestIds(
  {
    button: 'button',
  },
  'layersButton'
);

export { dataTestIds as dataTestIdsLayersButton };

export const LayersButton: React.FC = () => {
  const { parameters, setParameters } = useQueryParameter();

  const areLayersApplied = parameters.showSerials || parameters.showIrrigationLayer || parameters.showCommentsLayer;

  function handleClearLayers() {
    setParameters({
      showSerials: false,
      showIrrigationLayer: false,
      showCommentsLayer: false,
    });
  }

  return (
    <PopoverButton
      handleClear={areLayersApplied ? handleClearLayers : undefined}
      buttonTitle="LAYERS"
      tooltipTitle="Manage layers"
      icon={<Layers />}
      button-data-testid={dataTestIds.button}
    >
      <ShowIrrigationLayerButton />
      <ShowCommentsLayerButton />
      <ShowSerialsLayerButton />
    </PopoverButton>
  );
};
