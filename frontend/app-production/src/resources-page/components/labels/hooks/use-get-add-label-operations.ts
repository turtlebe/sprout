import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useGetRequest } from '@plentyag/core/src/hooks/use-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

function checkForLabel(labelName: string, labelType: ProdResources.LabelTypes, states: ProdResources.ResourceState[]) {
  return states.some(state =>
    labelType === 'CONTAINER' ? state.containerLabels?.includes(labelName) : state.materialLabels?.includes(labelName)
  );
}

/**
 * Returns the all of the add label operations that have been performed on the current state
 * for the given labelType (CONTAINER or MATERIAL).
 * @param searchResult  Current search result - if this changes then reload the operations.
 * @param labelType  All labels must be the same type either 'CONTAINER' or 'MATERIAL'.
 */
export function useGetAddLabelOperations(
  labelType: ProdResources.LabelTypes,
  searchResult?: ProdResources.ResourceState
) {
  const snackbar = useGlobalSnackbar();

  const url = '/api/plentyservice/traceability3/get-add-label-operations';
  const { makeRequest, data: labelOperations } = useGetRequest<ProdActions.OperationDeltaModel[]>({ url });

  // support refreshing data when search result changes. for example, a new label could have been added then
  // we'll need to refresh here to updated add label operations.
  React.useEffect(() => {
    const id = labelType === 'CONTAINER' ? searchResult?.containerId : searchResult?.materialId;
    if (searchResult && id) {
      const idType = labelType === 'CONTAINER' ? 'CONTAINER_ID' : 'MATERIAL_ID';
      void makeRequest({
        queryParams: { id: id, id_type: idType },
        onError: err =>
          snackbar.errorSnackbar({
            message: `Error getting label operations ${id}/${labelType}: ${parseErrorMessage(err)}`,
          }),
      });
    }
  }, [searchResult]);

  let foundAddLabelOperations: Map<string, ProdActions.OperationDeltaModel> = undefined;

  if (searchResult && labelOperations) {
    const labels = labelType === 'CONTAINER' ? searchResult?.containerLabels : searchResult?.materialLabels;
    foundAddLabelOperations = new Map();
    labelOperations.forEach(op => {
      labels.forEach(label => {
        const doesLabelExistInStateIn = checkForLabel(label, labelType, op.statesIn);
        const doesLabelExistInStateOut = checkForLabel(label, labelType, op.statesOut);
        if (!doesLabelExistInStateIn && doesLabelExistInStateOut) {
          foundAddLabelOperations.set(label, op);
        }
      });
    });
  }

  return { isLoading: !foundAddLabelOperations, foundAddLabelOperations };
}
