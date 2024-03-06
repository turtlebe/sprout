import { Grid } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { AssociatedCropsSkus, CropBasics } from '..';
import { CropWithFarmInfo } from '../../../common/types';

const dataTestIds = {
  root: 'crop-information-panel-root',
};

export { dataTestIds as dataTestIdsCropInformationPanel };

export interface CropInformationPanel {
  crop: CropWithFarmInfo;
}

export const CropInformationPanel: React.FC<CropInformationPanel> = ({ crop }) => {
  if (!crop) {
    return null;
  }

  return (
    <Grid data-testid={dataTestIds.root} container spacing={2}>
      <CropBasics crop={crop} />
      <AssociatedCropsSkus crop={crop} />
    </Grid>
  );
};
