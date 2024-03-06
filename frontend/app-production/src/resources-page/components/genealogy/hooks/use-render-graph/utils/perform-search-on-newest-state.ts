import { SearchActions } from '@plentyag/app-production/src/resources-page/hooks/use-search';

export function performSearchOnNewestState(
  resource: ProdResources.BaseResource<ProdResources.Operation>,
  search: SearchActions['search']
) {
  // performace search on the newest state (could be one that is not displayed currently)
  const newestOp = resource.newestOperationNotShown || resource.operations[resource.operations.length - 1];
  const id = newestOp?.stateIn?.id;
  id && search(id);
}
