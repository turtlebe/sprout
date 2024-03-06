export function hasContainerOrMaterial(searchResult: ProdResources.ResourceState) {
  const hasMaterial = !!searchResult?.materialId;
  const hasContainer = !!searchResult?.containerId;
  return { hasMaterial, hasContainer };
}
