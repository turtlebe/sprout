import { useFetchObservationGroups, UseFetchObservationGroupsReturn } from '@plentyag/core/src/hooks';
import { buildTreeForObservationGroups, duplicateGroupAtEachLevel } from '@plentyag/core/src/utils/observation-groups';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../use-autocomplete-farm-def-object-store';

export interface UseLoadObservationGroupsReturn extends UseFetchObservationGroupsReturn {}

/**
 * Load ObservationGroups into the state if showObservationStats is set to true.
 */
export const useLoadObservationGroups = (id: string, showObservationStats: boolean): UseLoadObservationGroupsReturn => {
  const [, actions] = useAutocompleteFarmDefObjectStore(id);

  const request = useFetchObservationGroups(showObservationStats);
  const { observationGroups } = request;

  const treeObservationGroups = React.useMemo(() => {
    return observationGroups
      ? buildTreeForObservationGroups(duplicateGroupAtEachLevel(observationGroups))
      : { count: 0, children: {} };
  }, [observationGroups]);

  React.useEffect(() => {
    actions.setTreeObservationGroups(treeObservationGroups);
  }, [treeObservationGroups]);

  return request;
};
