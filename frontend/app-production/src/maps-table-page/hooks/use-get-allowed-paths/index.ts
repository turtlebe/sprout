import { getFarmDefPath } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/utils';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { isFarmDefSite } from '@plentyag/core/src/farm-def/type-guards';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { useGetFarmDefObjectByPath } from '../../../common/hooks';

interface useGetAllowedPathsReturn {
  allowedPaths: string[];
  initialPath: string;
}

/**
 * The purpose of this hook is to determine the "allowedPaths" and "initialPath" that can then be used to drive the
 * "AutocompleteFarmDefObject". The "allowedPaths" are derivied from the "curerntFarmDefPath" (recall
 * currentFarmDefPath is the users current farm path, ex: sites/SSF2/farms/Tigris). The "allowedPaths"
 * are the set of paths that can be selected in the "AutoCompleteFarmDefObject".
 *
 * When the "currentFarmDefPath" changes, this hook determines if the given "selectedFarmDefPath" is allowed and set
 * the "initialPath" accordingly. That is, both the site and area from the "selectedFarmDefPath" must be
 * contained within the "currentFarmDefPath". If the path is not allowed, then the "initialPath" is reset
 * to the site of the currentFarmDefPath, otherwise the initialPath is set to the "selectedFarmDefPath".
 *
 * For example: "currentFarmDefPath" could be "sites/SSF2/farms/Tigris", so the "selectedFarmDefPath" must have
 * a site that is "SSF2" and the selected area must be within areas allowed by Tigris farm (which is determined by
 * looking at the mappings object in the farm).
 *
 * @param selectedFarmDefPath The current selectedFarmDefPath.
 * @returns
 *  allowedPaths: array of paths allowed to be selected in the "AutocompleteFarmDefObject".
 *    ex: [ 'sites/SSF2/areas/BMP', 'sites/SSF2/areas/VerticalGrow' ]
 *    Means that any path that is parent or child of BMP or VerticalGrow is an allowed path.
 *  initialPath: the initialPath for the "AutocompleteFarmDefObject".
 */
export const useGetAllowedPaths = (selectedFarmDefPath?: string): useGetAllowedPathsReturn => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;
  const currentFarmDefSite = getKindFromPath(currentFarmDefPath, 'sites');
  const currentFarmDefSitePath = currentFarmDefSite && `sites/${currentFarmDefSite}`;
  const { data: currentFarmDefSiteObj } = useGetFarmDefObjectByPath(currentFarmDefSitePath, 1);

  const [paths, setPaths] = React.useState<useGetAllowedPathsReturn>({
    initialPath: '',
    allowedPaths: undefined,
  });

  React.useEffect(() => {
    if (currentFarmDefPath && currentFarmDefSiteObj) {
      const selectedSite = getKindFromPath(selectedFarmDefPath, 'sites') || '';
      const selectedArea = getKindFromPath(selectedFarmDefPath, 'areas') || '';
      const selectedLine = getKindFromPath(selectedFarmDefPath, 'lines') || '';

      const allowedAreas = [];

      if (isFarmDefSite(currentFarmDefSiteObj)) {
        // determine the set of allowedAreas from the farm given in "currentFarmDefPath".
        // Uses the mappings object on the farm object to determine the "areas" that this farm maps to.
        const currentFarmDefFarm = getKindFromPath(currentFarmDefPath, 'farms');
        const currentFarmDefFarmObj = currentFarmDefSiteObj.farms[currentFarmDefFarm];
        const toIds = currentFarmDefFarmObj.mappings.map(obj => obj.type === 'relates' && obj.to).filter(item => item);
        const currentFarmDefAreaObjs = currentFarmDefSiteObj.areas;
        Object.keys(currentFarmDefAreaObjs).forEach(area => {
          const areaObj = currentFarmDefAreaObjs[area];
          if (toIds.includes(areaObj.id)) {
            allowedAreas.push(areaObj.path);
          }
        });

        // if has a selected site and not an allowed site - then reset initialPath
        if (selectedSite && currentFarmDefSite !== selectedSite) {
          setPaths({
            allowedPaths: allowedAreas,
            initialPath: currentFarmDefSitePath,
          });
          return;
        }

        // if has an selected area and area is not in allowed list - then reset initialPath.
        const selectedAreaPath = selectedSite && selectedArea && getFarmDefPath([selectedSite, selectedArea].join('/'));
        if (selectedAreaPath && !allowedAreas.includes(selectedAreaPath)) {
          setPaths({
            allowedPaths: allowedAreas,
            initialPath: currentFarmDefSitePath,
          });
          return;
        }
      }

      // site and area (if exists) are within the allowed site and areas, so set initialPath.
      setPaths({
        allowedPaths: allowedAreas,
        initialPath: selectedSite
          ? getFarmDefPath([selectedSite, selectedArea, selectedLine].join('/'))
          : currentFarmDefSitePath,
      });
    }
  }, [currentFarmDefPath, currentFarmDefSiteObj]);

  return { allowedPaths: paths.allowedPaths, initialPath: paths.initialPath };
};
