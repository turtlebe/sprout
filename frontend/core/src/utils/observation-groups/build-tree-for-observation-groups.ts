import { ObservationGroup } from '@plentyag/core/src/types';
import { Dictionary, groupBy, reduce, sumBy } from 'lodash';

export interface TreeNodeCount {
  count: number;
  lastObservedAt?: string;
  children: {
    [key: string]: TreeNodeCount;
  };
}

/**
 * Transforms an array of ObservationGroup into a {@see TreeNodeCount} Tree Object with three level.
 *
 * # First level
 *
 * The keys are the paths.
 * The values are objects containing the count of observation and the MeasurementTypes for the
 * given path.
 *
 * # Second level
 *
 * The keys are the MeasurementTypes.
 * The values are objects containing the count of observation and the ObservationNames for the given path and MeasurementType.
 *
 * # Third level
 *
 * The keys are the ObservationsNames.
 * The values are objects containing the count of observation for the given path, MeasurementType and ObservationName.
 */
export function buildTreeForObservationGroups(observationGroups: ObservationGroup[]): TreeNodeCount {
  // Filter ObservationGroups that don't have a path.
  const validObservationGroups = observationGroups.filter(observationGroup => observationGroup.path);

  // Group by path
  const groupedByPath = groupBy(validObservationGroups, observationGroup => observationGroup.path);

  function createObservationNameLevel(observationGroups: ObservationGroup[]): TreeNodeCount['children'] {
    return observationGroups.reduce<TreeNodeCount['children']>((result, observationGroup) => {
      result[observationGroup.observationName] = {
        count: observationGroup.count,
        lastObservedAt: observationGroup.lastObservedAt,
        children: {},
      };

      return result;
    }, {});
  }

  function createMeasurementTypeLevel(
    observationGroupsByMeasurementTypes: Dictionary<ObservationGroup[]>
  ): TreeNodeCount['children'] {
    return reduce<Dictionary<ObservationGroup[]>, TreeNodeCount['children']>(
      observationGroupsByMeasurementTypes,
      (result, observationGroups, measurementType) => {
        result[measurementType] = {
          // Count how many observations for the given MeasurementType
          count: sumBy(observationGroups, 'count'),

          // Create the next level in hiearchy containing the ObservationNames.
          children: createObservationNameLevel(observationGroups),
        };

        return result;
      },
      {}
    );
  }

  function createPathLevel(observationGroupsByPath: Dictionary<ObservationGroup[]>): TreeNodeCount['children'] {
    return reduce<Dictionary<ObservationGroup[]>, TreeNodeCount['children']>(
      observationGroupsByPath,
      (result, observationGroups, path) => {
        // Group the subset of observationGroups by MeasurementType for the next level.
        const observationGroupsByMeasurementType = groupBy(
          observationGroups,
          observationGroup => observationGroup.measurementType
        );

        result[path] = {
          // Count how many observations for the given path
          count: sumBy(observationGroups, 'count'),

          // Create the next level in hiearchy containing the MeasurementTypes.
          children: createMeasurementTypeLevel(observationGroupsByMeasurementType),
        };

        return result;
      },
      {}
    );
  }

  return {
    // count is 0 because we don't care or display the count of the root level, so not calculating it.
    count: 0,
    children: createPathLevel(groupedByPath),
  };
}
