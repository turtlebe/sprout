import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { toQueryParams } from '@plentyag/core/src/utils';

import { AutocompleteFarmDefObjectState } from '../hooks';

const getIncludeKinds = (options: AutocompleteFarmDefObjectState['options']): string[] => {
  const includeKinds = [];

  if (options.showContainerLocations) {
    includeKinds.push('containerLocation');
  }

  if (options.showDeviceLocations) {
    includeKinds.push('deviceLocation');
  }

  if (options.showScheduleDefinitions || options.showScheduleDefinitionParents) {
    includeKinds.push('scheduleDefinition');
  }

  return includeKinds.length === 0 ? undefined : includeKinds;
};

/**
 * @param farmDefObject FarmDef Object
 * @return URL to query a FarmDef Object by its id
 */
export const getFarmDefObjectByIdUrl = (
  farmDefObject: FarmDefObject,
  options: AutocompleteFarmDefObjectState['options']
) => {
  if (!farmDefObject) {
    return undefined;
  }

  return `/api/swagger/farm-def-service/objects-v3-api/get-object-by-id2/${farmDefObject.id}${toQueryParams(
    {
      depth: -1,
      include_kinds: getIncludeKinds(options),
    },
    { doNotEncodeArray: true }
  )}`;
};

/**
 * @param path FarmDef Path
 * @return URL to query a FarmDef Object with a FarmDef Path
 */
export const getFarmDefObjectByPathUrl = (path: string, options: AutocompleteFarmDefObjectState['options']) => {
  if (!path) {
    return undefined;
  }

  return `/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/${path}${toQueryParams(
    {
      depth: -1,
      include_kinds: getIncludeKinds(options),
    },
    { doNotEncodeArray: true }
  )}`;
};
