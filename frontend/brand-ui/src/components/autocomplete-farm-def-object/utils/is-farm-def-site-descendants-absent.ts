import { FarmDefSite } from '@plentyag/core/src/farm-def/types';

import { AutocompleteFarmDefObjectState } from '../hooks';

/**
 * Lookup the store to see if a FarmDef site has no descendants loaded yet.
 *
 * @param farmDefSite FarmDefSite
 * @param state @see AutocompleteFarmDefObjectState
 * @return whether a FarmDef Site has no descendants in the store.
 */
export function isFarmDefSiteDescendantsAbsent(
  farmDefSite: FarmDefSite,
  state: AutocompleteFarmDefObjectState
): boolean {
  return (
    state.farmDefObjects.findIndex(
      object => object.path.startsWith(farmDefSite.path) && farmDefSite.path !== object.path
    ) === -1
  );
}
