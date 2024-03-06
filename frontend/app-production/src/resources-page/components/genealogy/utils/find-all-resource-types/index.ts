export function findAllResourceTypes(operations: ProdResources.Operation[]) {
  const materialOrContainerTypes: ProdResources.ResourceTypes[] = [];

  function getMaterialType(resourceState: ProdResources.ResourceState) {
    return resourceState?.materialObj?.materialType;
  }

  function getContainerType(resourceState: ProdResources.ResourceState) {
    return resourceState?.containerObj?.containerType;
  }

  operations.forEach(operation => {
    materialOrContainerTypes.push(getMaterialType(operation.stateIn));
    materialOrContainerTypes.push(getMaterialType(operation.stateOut));
    materialOrContainerTypes.push(getContainerType(operation.stateIn));
    materialOrContainerTypes.push(getContainerType(operation.stateOut));
  });

  return [...new Set(materialOrContainerTypes)].filter(type => type);
}
