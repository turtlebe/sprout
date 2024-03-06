import { hasContainerOrMaterial } from '../../../utils/hasContainerOrMaterial';

/**
 * Returns a list of operations allowed for given resource state.
 * @param searchResult Current resource state.
 */
export function getAllowedOperations(searchResult: ProdResources.ResourceState): ProdActions.AllowedOperation[] {
  const operations: ProdActions.AllowedOperation[] = [];

  const site = searchResult?.location?.machine?.siteName;

  if (!site || searchResult?.containerObj?.containerType === 'CARRIER') {
    return operations;
  }

  const { hasContainer, hasMaterial } = hasContainerOrMaterial(searchResult);

  if (hasContainer) {
    const prefilledArgs = {
      serial: { isDisabled: true, value: searchResult.containerObj.serial },
    };

    if (searchResult.containerStatus !== 'TRASHED') {
      operations.push({
        name: 'TrashContainer',
        displayName: 'Trash',
        prefilledArgs,
      });

      operations.push({
        name: 'AddOrChangeCrop',
        displayName: 'Add Or Change Crop',
        prefilledArgs,
      });
    }

    if (searchResult.containerStatus === 'TRASHED') {
      operations.push({
        name: 'UntrashContainer',
        displayName: 'Untrash',
        prefilledArgs,
      });
    }

    const washOperation = {
      name: 'WashContainer',
      displayName: 'Wash',
      prefilledArgs,
    };

    const moveOperation = {
      name: 'MoveContainer',
      displayName: 'Move',
      prefilledArgs,
    };

    operations.push(washOperation, moveOperation);
  } else if (hasMaterial) {
    const prefilledArgs = {
      lot_name: { isDisabled: true, value: searchResult.materialObj.lotName },
    };

    operations.push({
      name: 'ChangeMaterialCrop',
      displayName: 'Change Crop',
      prefilledArgs,
    });

    operations.push({
      name: 'MoveMaterial',
      displayName: 'Move',
      prefilledArgs,
    });
  }

  if (hasMaterial && hasContainer) {
    const ScrapOperation = {
      name: 'ScrapMaterial',
      displayName: 'Scrap',
      prefilledArgs: {
        serial: { isDisabled: true, value: searchResult.containerObj.serial },
      },
    };

    operations.push(ScrapOperation);
  }

  return operations;
}
