import { canShowCaseQuantityPerPallet } from '@plentyag/app-crops-skus/src/common/utils';
import { Card, Show } from '@plentyag/brand-ui/src/components';
import { Box, Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefSku, FarmDefSkuType } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { CropLink, CropSkuCardItem, SkuLink } from '../../common/components';
import { skusTableCols } from '../../skus-page/utils';
interface AssociatedCropsSkus {
  sku: FarmDefSku;
  skuTypes: FarmDefSkuType[];
}

export const AssociatedCropsSkus: React.FC<AssociatedCropsSkus> = ({ sku, skuTypes }) => {
  const NONE = 'none';

  return (
    <Grid item xs={6}>
      <Card title="Associated Crops and SKUs" isLoading={false}>
        <CropSkuCardItem
          tableCol={skusTableCols.allowedCropNames}
          value={
            sku?.allowedCropNames?.length > 0 ? (
              <Box>
                {sku.allowedCropNames.map(cropName => (
                  <Box key={cropName} display="inline" mr={1}>
                    <CropLink cropName={cropName} />
                  </Box>
                ))}
              </Box>
            ) : (
              NONE
            )
          }
        />
        <CropSkuCardItem
          tableCol={skusTableCols.childSkuName}
          value={sku?.childSkuName ? <SkuLink skuName={sku.childSkuName} /> : NONE}
        />
        <Show when={canShowCaseQuantityPerPallet(sku.skuTypeName, skuTypes)}>
          <CropSkuCardItem
            tableCol={skusTableCols.caseQuantityPerPallet}
            value={sku?.caseQuantityPerPallet?.toString()}
          />
        </Show>
      </Card>
    </Grid>
  );
};
