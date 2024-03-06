import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import React from 'react';

export function useGetParentChildResources(searchResult: ProdResources.ResourceState) {
  const snackbar = useGlobalSnackbar();

  const [parentResource, setParentResource] = React.useState<ProdResources.ResourceState>(null);
  const [childResources, setChildResources] = React.useState<ProdResources.ResourceState[]>(null);

  const { error, isLoading, makeRequest } = usePostRequest<ProdResources.ResourceState[], ProdResources.StateId[]>({
    url: '/api/plentyservice/traceability3/get-states-by-historic-ids',
  });

  React.useEffect(() => {
    if (!searchResult) {
      return;
    }
    const childIds =
      searchResult.childResourceStateIds && searchResult.childResourceStateIds.length > 0
        ? searchResult.childResourceStateIds
        : [];
    const parentId = searchResult.parentResourceStateId;

    if (childIds.length > 0 || parentId) {
      const ids = childIds.concat(parentId);
      void makeRequest({
        data: ids,
        onSuccess: responseData => {
          // note: data result from api can come in any order, so need to filter to find id.
          if (parentId) {
            const parentResource = responseData.find(resource => resource.id === parentId);
            setParentResource(parentResource);
          } else {
            setParentResource(null);
          }
          if (childIds.length > 0) {
            const childResources = responseData.filter(resource => childIds.includes(resource.id));
            setChildResources(childResources);
          } else {
            setChildResources(null);
          }
        },
        onError: error => {
          setChildResources(null);
          setParentResource(null);
          const err = error.data?.message?.error || '';
          snackbar.errorSnackbar({ message: `Error fetching children/parent states ${err}` });
        },
      });
    }
  }, [searchResult]);

  return {
    error,
    isLoading,
    parentResource,
    childResources,
  };
}
