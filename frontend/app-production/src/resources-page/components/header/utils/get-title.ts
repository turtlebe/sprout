import { hasContainerOrMaterial } from '../../../utils/hasContainerOrMaterial';

export function getTitle(searchResult: ProdResources.ResourceState) {
  if (!searchResult) {
    return '';
  }

  const { hasContainer, hasMaterial } = hasContainerOrMaterial(searchResult);

  const container = hasContainer ? searchResult.containerObj.containerType : undefined;

  const material = hasMaterial ? searchResult.materialObj.product || searchResult.materialObj.materialType : undefined;

  const title = material && container ? `${container} with ${material}` : material ?? container;

  return searchResult.isLatest ? title : `${title} (historic state)`;
}
