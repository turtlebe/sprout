export function findOperationConsumingMaterialId(
  operations: ProdResources.Operation[],
  materialId: string
): ProdResources.Operation {
  if (!materialId) {
    return null;
  }
  return operations.find(op => op.materialsConsumed?.includes(materialId));
}
