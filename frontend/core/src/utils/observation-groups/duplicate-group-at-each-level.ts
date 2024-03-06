import { ObservationGroup } from '@plentyag/core/src/types';
import { getAllParentPaths } from '@plentyag/core/src/utils';
import { flatMap } from 'lodash';

/**
 * Takes an array of ObservationGroup and duplicate the group for each parent level.
 *
 * For example, passing the following groups:
 *
 * [
 *   { path: 'sites/SSF2/areas/SierraVerticalGrow/lines/VerticalGrow', measurementType: 'A', observationName: 'B', count: 1, lastObservedAt: '2022-01-01T00:00:00Z' }
 * ]
 *
 * Will return:
 *
 * [
 *   { path: 'sites/SSF2', measurementType: 'A', observationName: 'B', count: 1, lastObservedAt: '2022-01-01T00:00:00Z' }
 *   { path: 'sites/SSF2/areas/SierraVerticalGrow', measurementType: 'A', observationName: 'B', count: 1, lastObservedAt: '2022-01-01T00:00:00Z' }
 *   { path: 'sites/SSF2/areas/SierraVerticalGrow/lines/VerticalGrow', measurementType: 'A', observationName: 'B', count: 1, lastObservedAt: '2022-01-01T00:00:00Z' }
 * ]
 */
export function duplicateGroupAtEachLevel(observationGroups: ObservationGroup[]): ObservationGroup[] {
  return flatMap(
    observationGroups
      .filter(observationGroup => observationGroup.path)
      .map(observationGroup => [
        ...getAllParentPaths(observationGroup.path).map(parentPath => ({ ...observationGroup, path: parentPath })),
        observationGroup,
      ])
  );
}
