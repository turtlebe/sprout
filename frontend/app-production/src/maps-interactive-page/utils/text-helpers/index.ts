import { ContainerLocation } from '@plentyag/core/src/farm-def/types';
import { titleCase } from 'voca';

import { MAX_CROPS } from '../../constants';
import { ContainerData } from '../../types';

export const UNOCCUPIED_SLOT = 'Unoccupied slot';

export const getTitleFromResourceState = (
  resourceState: ProdResources.ResourceState,
  containerLocation?: ContainerLocation
) => {
  const containerObj = resourceState?.containerObj;
  const materialObj = resourceState?.materialObj;
  const containerType = containerObj?.containerType ?? containerLocation?.containerTypes?.[0] ?? 'container';

  const crops = materialObj?.product?.split(',').map(crop => crop.trim());
  const cropsWithEllipseWhenMoreThanTwo =
    crops?.slice(0, MAX_CROPS).join('/') + (crops?.length > MAX_CROPS ? '/...' : '');

  return containerObj && materialObj
    ? `${titleCase(containerType)} with ${cropsWithEllipseWhenMoreThanTwo}`
    : containerObj
    ? `Empty ${containerType.toLowerCase()}`
    : materialObj
    ? `Uncontained ${cropsWithEllipseWhenMoreThanTwo}`
    : UNOCCUPIED_SLOT;
};

export const getTitleFromContainerData = (data: ContainerData) => {
  // Return conflicting title
  if (data?.conflicts) {
    const containerType = data?.containerLocation?.containerTypes?.[0] ?? 'container';
    return `Conflicting ${containerType.toLowerCase()}s`;
  }
  return getTitleFromResourceState(data?.resourceState, data?.containerLocation);
};
