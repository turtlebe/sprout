import { ValueGetterParams } from '@ag-grid-community/all-modules';

/**
 * Extracts the first element of the StateOut from the ag-grid data.
 * @param params The ag-grid params provided to a valueGetter.
 */
export function getStateOut(params: ValueGetterParams): undefined | ProdResources.ResourceState {
  const statesOut = params?.data?.statesOut;
  if (Array.isArray(statesOut) && statesOut.length > 0) {
    return statesOut[0];
  }
}
