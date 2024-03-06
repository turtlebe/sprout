import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { LayersButtonItem } from '../layers-button-item';

const dataTestIds = {
  switch: 'show-serials-switch-switch',
};

export { dataTestIds as dataTestIdsShowSerialsLayerButton };

export const ShowSerialsLayerButton: React.FC = () => {
  const { parameters, setParameters } = useQueryParameter();

  function handleShowSerialChange(checked: boolean) {
    setParameters({ showSerials: checked });
  }

  return (
    <LayersButtonItem
      icon={
        <Typography style={{ fontSize: '0.9rem' }}>
          <b>123</b>
        </Typography>
      }
      title="Table Serial Number"
      isChecked={parameters.showSerials}
      handleToggle={handleShowSerialChange}
      switchDataTestId={dataTestIds.switch}
    />
  );
};
