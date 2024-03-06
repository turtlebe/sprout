import { getCrops } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { PlentyLink, Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { MAX_CROPS } from '../../constants';
import { EMPTY_CONTAINER_COLOR, GetCropColor, MapsState } from '../../types';

import { EMPTY_CONTAINER } from './types';
import { getCropCount, getSortedCrops } from './utils';

const dataTestIds = {
  root: 'legend',
  legendItemColorBox: (crop: string) => `legend-item-color-box-${crop}`,
  legendItemContainer: (crop: string) => `legend-item-container-${crop}`,
  legendItemCrop: (crop: string) => `legend-item-crop-${crop}`,
  legendItemLink: (crop: string) => `legend-item-link-${crop}`,
  legendItemCount: (crop: string) => `legend-item-count-${crop}`,
  legendItemEmptyContainer: (crop: string) => `legend-item-name-container-${crop}`,
};

export const CROPS_BASE_URL = '/crops-skus/crops/';

export { dataTestIds as dataTestIdsLegend };

export interface Legend {
  getCropColor: GetCropColor;
  mapsState: MapsState;
  showCropLinks?: boolean;
}

export const Legend: React.FC<Legend> = ({ getCropColor, mapsState, showCropLinks = false }) => {
  const cropCount = getCropCount(mapsState);
  const sortedCrops = getSortedCrops(Object.keys(cropCount));

  const cropLegendItems = sortedCrops.map(crop => {
    // each crop from traceability can either be a single crop (ex: 'B11') or
    // a comma separate list of crops (ex: 'B11,CRC'). This is the case when a
    // container (ex: table) has trays with different crops.
    const containerCrops = getCrops(crop);
    const cropLinks = containerCrops.map((containerCrop, index) => {
      if (index === MAX_CROPS) {
        return (
          <Typography key="ellipse" variant="subtitle2">
            ...
          </Typography>
        );
      }
      if (index > MAX_CROPS) {
        return null;
      }
      return (
        <Box key={containerCrop}>
          {containerCrop === EMPTY_CONTAINER ? (
            <Typography variant="subtitle2" data-testid={dataTestIds.legendItemEmptyContainer(EMPTY_CONTAINER)}>
              {containerCrop}
            </Typography>
          ) : (
            <Typography style={{ display: 'flex' }} variant="subtitle2" data-testid={dataTestIds.legendItemCrop(crop)}>
              <Show when={showCropLinks} fallback={<>{containerCrop}</>}>
                <PlentyLink
                  openInNewTab
                  data-testid={dataTestIds.legendItemLink(crop)}
                  to={`${CROPS_BASE_URL}${containerCrop}`}
                >
                  {containerCrop}
                </PlentyLink>
              </Show>
              {index !== containerCrops.length - 1 ? '/' : ' '}
            </Typography>
          )}
        </Box>
      );
    });

    const isEmptyContainer = containerCrops[0] === EMPTY_CONTAINER;
    const cropColor = isEmptyContainer ? EMPTY_CONTAINER_COLOR : getCropColor(containerCrops[0]);

    // when container has more than one crop, then used the 2nd crop as the color on diagonal stripe.
    const secondCropColor = containerCrops.length > 1 ? getCropColor(containerCrops[1]) : undefined;
    const background = secondCropColor ? `linear-gradient(135deg, ${cropColor} 50%, ${secondCropColor} 50%` : cropColor;

    return (
      <Box data-testid={dataTestIds.legendItemContainer(crop)} display="flex" flexWrap="wrap" mr={1.5} key={crop}>
        <Box
          data-testid={dataTestIds.legendItemColorBox(crop)}
          alignSelf="center"
          width="14px"
          height="14px"
          mr={0.5}
          borderRadius="3px"
          style={{ background }}
        />
        {cropLinks}
        <Typography
          variant="subtitle2"
          style={{ marginLeft: '0.1rem' }}
          data-testid={dataTestIds.legendItemCount(crop)}
        >
          ({cropCount[crop]})
        </Typography>
      </Box>
    );
  });

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center" data-testid={dataTestIds.root}>
      {cropLegendItems}
    </Box>
  );
};
