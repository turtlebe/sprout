import { Card } from '@plentyag/brand-ui/src/components/card';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { ChildCrop } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { CropLink, CropSkuCardItem, SkuLink } from '../../../common/components';
import { CropWithFarmInfo } from '../../../common/types';
import { cropsTableCols } from '../../../crops-page/utils';

const dataTestIds = {
  table: 'associated-skus-table',
  tableRow: (childCrop: ChildCrop) => `associated-skus-child-crops-row-${childCrop.defaultCropName}`,
};

export { dataTestIds as dataTestIdsAssociatedCropsSkus };

interface AssociatedSkus {
  crop: CropWithFarmInfo;
}

export const AssociatedCropsSkus: React.FC<AssociatedSkus> = ({ crop }) => {
  const NONE = 'none';

  return (
    <Grid item xs={6}>
      <Card title="Associated Crops and SKUs" isLoading={false}>
        <CropSkuCardItem
          tableCol={cropsTableCols.skus}
          value={
            crop?.skus?.length > 0 ? (
              <>
                {crop.skus.map(skuName => (
                  <Box key={skuName} display="inline" mr={1}>
                    <SkuLink skuName={skuName} />
                  </Box>
                ))}
              </>
            ) : (
              NONE
            )
          }
        />

        <CropSkuCardItem
          tableCol={cropsTableCols.childCrops}
          value={
            crop?.childCrops?.length > 0 ? (
              <TableContainer data-testid={dataTestIds.table}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Primary Associated Crop</TableCell>
                      <TableCell>Allowed Associated Crops</TableCell>
                      <TableCell>Min Ratio</TableCell>
                      <TableCell>Max Ratio</TableCell>
                      <TableCell>Target Ratio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {crop.childCrops.map(childCrop => (
                      <TableRow key={childCrop.defaultCropName} data-testid={dataTestIds.tableRow(childCrop)}>
                        <TableCell>
                          <CropLink cropName={childCrop.defaultCropName} />
                        </TableCell>
                        <TableCell>
                          {childCrop.allowedCropNames.map(cropName => (
                            <Box key={cropName} display="inline" mr={1}>
                              <CropLink cropName={cropName} />
                            </Box>
                          ))}
                        </TableCell>
                        <TableCell>{childCrop.minRatio}</TableCell>
                        <TableCell>{childCrop.maxRatio}</TableCell>
                        <TableCell>{childCrop.targetRatio}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              NONE
            )
          }
        />
      </Card>
    </Grid>
  );
};
