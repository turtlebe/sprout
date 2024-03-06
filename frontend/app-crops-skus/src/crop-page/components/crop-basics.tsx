import { Card } from '@plentyag/brand-ui/src/components/card';
import { Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { CropSkuCardItem } from '../../common/components';
import { cropsTableCols } from '../../crops-page/utils';

interface CropBasics {
  crop: FarmDefCrop;
}

export const CropBasics: React.FC<CropBasics> = ({ crop }) => {
  return (
    <Grid item xs={6}>
      <Card title="Crop Basics" isLoading={false}>
        <CropSkuCardItem
          tableCol={cropsTableCols.trialDescription}
          value={crop?.properties?.trialDescription && crop.properties.trialDescription.trim()}
        />
        <CropSkuCardItem tableCol={cropsTableCols.displayAbbreviation} value={crop?.displayAbbreviation} />
        <CropSkuCardItem tableCol={cropsTableCols.isSeedable} value={crop?.isSeedable ? 'True' : 'False'} />
        <CropSkuCardItem tableCol={cropsTableCols.media} value={crop?.media} />
        <CropSkuCardItem tableCol={cropsTableCols.cultivar} value={crop?.cultivar} />
        <CropSkuCardItem tableCol={cropsTableCols.scientificName} value={crop?.properties?.scientificName} />
        <CropSkuCardItem tableCol={cropsTableCols.cropTypeName} value={crop?.cropTypeName} />
      </Card>
    </Grid>
  );
};
