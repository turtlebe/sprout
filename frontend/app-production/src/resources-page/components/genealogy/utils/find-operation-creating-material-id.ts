export function findOperationCreatingMaterialId(
  operations: ProdResources.Operation[],
  materialId: string
): ProdResources.Operation {
  if (!materialId) {
    return null;
  }
  return operations.find(op => op.materialsCreated?.includes(materialId));
}
