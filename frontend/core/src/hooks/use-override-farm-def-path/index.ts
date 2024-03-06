import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { useUpdateCurrentFarmDefPath } from '..';

/**
 * Will override the "currentFarmDefPath" (from the user store) when the given override path is in allowed list.
 * If override is not in allowed list, then permission error is given to the user and fallback back to "currentFarmDefPath".
 * If no override value is provided then just uses the value from user store "currentFarmDefPath"
 *
 * Typically this hook would be used to pass in farm/site path from a url path. In this way, the url farm/site
 * path overrides the "currentFarmDefPath" value.
 *
 * @param overrideFarmSitePath Path in the form sites/{sites}/farms/{farm} that is used to override the "currentFarmDefPath".
 * @returns a farm/site path (e.g. sites/SSF2/farms/Tigris)
 */
export const useOverrideFarmDefPath = (
  currentFarmDefPath: string,
  allowedFarmDefPaths: string[],
  overrideFarmDefPath?: string
): string => {
  const snackbar = useGlobalSnackbar();

  const { makeUpdate } = useUpdateCurrentFarmDefPath();

  const [farmDefPath, setFarmDefPath] = React.useState<string>();

  React.useEffect(() => {
    if (currentFarmDefPath && allowedFarmDefPaths && overrideFarmDefPath && overrideFarmDefPath !== farmDefPath) {
      if (!allowedFarmDefPaths.includes(overrideFarmDefPath)) {
        const shortenedOverrideFarmDefPath = getShortenedPath(overrideFarmDefPath);
        const shortenedFallbackFarmDefPath = getShortenedPath(currentFarmDefPath);
        snackbar.errorSnackbar({
          message: `Permission denied to view farm def path: ${shortenedOverrideFarmDefPath}.

Falling back to ${shortenedFallbackFarmDefPath}`,
        });
        setFarmDefPath(currentFarmDefPath);
        return;
      }

      setFarmDefPath(overrideFarmDefPath);
      makeUpdate(overrideFarmDefPath);
      return;
    }

    if (currentFarmDefPath && farmDefPath !== currentFarmDefPath) {
      setFarmDefPath(currentFarmDefPath);
    }
  }, [overrideFarmDefPath, currentFarmDefPath, allowedFarmDefPaths]);

  return farmDefPath;
};
