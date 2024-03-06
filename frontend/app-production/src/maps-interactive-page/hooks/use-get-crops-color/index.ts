import { hash } from '@plentyag/app-production/src/common/utils';
import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import React from 'react';

import { GetCropColor } from '../../types';

import { defaultColorMap, distinctColors } from './utils';

interface CropColorMap {
  [cropName: string]: string;
}

interface UseGetCropsColorReturn {
  getCropColor: GetCropColor;
  isLoading: boolean;
}

/**
 * This hooks generates a mapping from farm crop to unique color. Eventually this
 * data will come from the farm def search-crops api but for now we are using an
 * array of distinct colors to generate the map. For some specific crops we have
 * a fixed mapping from crop to color. In case we get a crop name that
 * does not exist in farm def a fallback color will be generated.
 */
export const useGetCropsColor = (): UseGetCropsColorReturn => {
  const { isValidating: isLoading, data: crops } = useSwrAxios<FarmDefCrop[]>({
    url: '/api/plentyservice/farm-def-service/search-crops',
  });

  const [cropColorMap, setCropColorMap] = React.useState<CropColorMap>(defaultColorMap);

  const getCropColor = React.useCallback(
    (cropName: string) => {
      const color = cropColorMap[cropName];

      if (color) {
        return color;
      }

      // in case we get a crop that for whatever reason does not exist in farm
      // def we'll generate a fallback color from the remaining list of un-used
      // distinct colors.
      const numUsedColors = Object.keys(cropColorMap).length;
      // check if all colors are used, then just select from entire list.
      const startColorIndex = numUsedColors >= distinctColors.length ? 0 : numUsedColors;
      // pick color in range [startColor, distinctColors.length-1]
      const cropNameHash = hash(cropName);
      const fallbackColorIndex = Math.round(
        startColorIndex + cropNameHash * (distinctColors.length - 1 - startColorIndex)
      );
      return distinctColors[fallbackColorIndex];
    },
    [cropColorMap]
  );

  React.useEffect(() => {
    if (crops) {
      const _cropColorMap: CropColorMap = defaultColorMap;
      const cropNames = crops.map(crop => crop.name).sort((a, b) => a.localeCompare(b));

      cropNames.forEach((cropName, index) => {
        if (!_cropColorMap[cropName]) {
          _cropColorMap[cropName] = distinctColors[index % distinctColors.length];
        }
      });

      setCropColorMap(_cropColorMap);
    }
  }, [crops]);

  return {
    isLoading,
    getCropColor,
  };
};
