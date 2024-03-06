/**
 * This function returns true if the given resource includes at least one material or
 * container label from the given labels array.
 */
export function doesResourceHaveMatchingLabel(resourceState: ProdResources.ResourceState, labels: string[]) {
  if (!labels || labels.length === 0) {
    return true;
  }

  return (
    resourceState?.containerLabels?.some(label => labels.includes(label)) ||
    resourceState?.materialLabels?.some(label => labels.includes(label))
  );
}
