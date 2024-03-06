import { LoadedAtAttributes } from '@plentyag/app-production/src/common/types/farm-state';

export const getEditableLoadAtAttributes = (resourceState: ProdResources.ResourceState): LoadedAtAttributes[] => {
  const areaName = resourceState?.location?.machine?.areaName;
  const serial = resourceState?.containerObj?.serial;
  const containerType = resourceState?.containerObj?.containerType;

  if (areaName && serial && containerType) {
    if (areaName === 'Germination' && containerType === 'TABLE') {
      return [LoadedAtAttributes.LOADED_IN_GERM_AT];
    }

    if (areaName === 'Propagation' && containerType === 'TABLE') {
      return [LoadedAtAttributes.LOADED_IN_GERM_AT, LoadedAtAttributes.LOADED_IN_PROP_AT];
    }

    if (areaName === 'VerticalGrow' && containerType === 'TOWER') {
      return [LoadedAtAttributes.LOADED_IN_GROW_AT];
    }
  }

  return [];
};
