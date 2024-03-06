import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';

/**
 * This method normalizes the ResourceState[] data into a hash based on coordinate
 */
export const getMapsStateFromChildResources = (childResources: ProdResources.ResourceState[]): MapsState => {
  return (childResources || []).reduce<MapsState>((agg, childResource) => {
    const { positionInParent } = childResource;
    agg[positionInParent] = {
      resourceState: childResource,
    };
    return agg;
  }, {});
};
