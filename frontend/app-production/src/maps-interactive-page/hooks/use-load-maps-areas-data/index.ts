import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import { isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefArea, FarmDefFarm, FarmDefLine } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { SupportedAreaClass, SupportedLineClass } from '../../types';

export interface UseLoadMapsAreasData {
  siteName: string;
  farmName: string;
  areaName?: string;
  lineName?: string;
}

export interface UseLoadMapsAreasDataReturn extends ReturnType<typeof useGetFarmDefObjectByPath> {
  areas: FarmDefArea[];
  lines: FarmDefLine[];
  farm?: FarmDefFarm;
  area?: FarmDefArea;
  line?: FarmDefLine;
}

/**
 * Hook to get the Farm Def Objects given the site/farm/area/line parameters
 * Returns:
 *  - areas: collection areas filtered by:
 *    - areas of the specified farm
 *    - areas supported by interactive maps
 *    - AND has supported lines (areas without supported lines are not included)
 *  - lines: collection of lines filtered by:
 *    - lines of the specified area
 *    - lines supported by interactive maps
 *  - farm: data of specified farm
 *  - area: data of specified area
 *  - line: data of specified line
 */
export const useLoadMapsAreasData = ({
  siteName,
  farmName,
  areaName,
  lineName,
}: UseLoadMapsAreasData): UseLoadMapsAreasDataReturn => {
  const currentFarmDefSitePath = `sites/${siteName}`;
  const request = useGetFarmDefObjectByPath(currentFarmDefSitePath, 2);
  const { data, isValidating } = request;

  const { areas, lines, farm, area, line } = React.useMemo(() => {
    let areas = [];
    let lines = [];
    let farm;
    let area;
    let line;

    if (!isValidating && isFarmDefSite(data)) {
      farm = data.farms[farmName];

      // Get Areas for this Site
      const areaObjs = data?.areas || {};

      // Filter down for only areas within the farm and supported area classes
      areas = Object.keys(areaObjs).reduce<FarmDefArea[]>((acc, areaKey) => {
        const areaObj = areaObjs[areaKey];
        const areaClass = areaObj.class;

        if (farm.mappings.find(item => item.to === areaObj.id) && SupportedAreaClass[areaClass]) {
          // Filter down lines for within in area for only supported line classes
          const lineObjs = areaObj?.lines;
          const areaLines = Object.keys(lineObjs).reduce<FarmDefArea['lines']>((acc, lineKey) => {
            const lineObj = lineObjs[lineKey];
            const lineClass = lineObj.class;
            if (SupportedLineClass[lineClass]) {
              acc[lineKey] = lineObj;
            }
            return acc;
          }, {});

          // Push new object with overridden supported lines
          if (Object.keys(areaLines).length) {
            acc.push({
              ...areaObj,
              lines: areaLines,
            });
          }
        }
        return acc;
      }, []);

      // Get selected area object by areaName
      if (areaName) {
        area = areas.find(area => area.name === areaName);
      }

      // Get Lines for this selected area
      const lineObjs = area?.lines;

      // Get Line objects in a list
      if (lineObjs) {
        lines = Object.values(lineObjs);

        // Get selected line object by lineName
        if (lineName) {
          line = lineObjs[lineName];
        }
      }
    }

    return { areas, lines, farm, area, line };
  }, [data, isValidating, farmName, areaName, lineName]);

  return {
    ...request,
    areas,
    lines,
    farm,
    area,
    line,
  };
};
