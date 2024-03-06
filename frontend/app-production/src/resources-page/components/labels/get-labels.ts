import { Label } from './index';

export function getLabels(searchResult?: ProdResources.ResourceState) {
  const containerLabels = searchResult?.containerLabels || [];
  const initialContainerLabels = containerLabels.map<Label>(label => {
    return { name: label, resourceId: searchResult.containerId, type: 'CONTAINER' };
  });

  const materialLabels = searchResult?.materialLabels || [];
  const initialMaterialLabels = materialLabels.map<Label>(label => {
    return { name: label, resourceId: searchResult.materialId, type: 'MATERIAL' };
  });

  const labels = initialContainerLabels.concat(initialMaterialLabels);

  return labels;
}
