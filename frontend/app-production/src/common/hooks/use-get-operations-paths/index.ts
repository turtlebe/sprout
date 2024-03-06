import { MethodTypes } from '@plentyag/core/src/farm-def/types';

import { useGetFarmDefObjectByPath } from '..';

/**
 * Hook that gets farm def operation paths (if exists) for the given set of operation names.
 * @param operationNamesToFind Name of operations for which we need to find the farm def paths.
 * @param methodType The operation type - either 'tell' or 'request' to search for.
 * @param siteName Farm def site under which we look for the given set of operations.
 */
export function useGetOperationsPaths(operationNamesToFind: string[], methodType: MethodTypes, siteName?: string) {
  const sitePath = `sites/${siteName}`;
  const { error, isValidating, data: farmDefSiteObject } = useGetFarmDefObjectByPath(siteName ? sitePath : null);

  const isLoading = siteName && !error && (isValidating || !farmDefSiteObject);

  // map from operation name (key) to path (value)
  const operationPaths = new Map<string, string>();

  if (farmDefSiteObject && farmDefSiteObject.interfaces) {
    // look in farm def site object and make sure each allowed operation exists in the "interfaces" object,
    // and get it's associated farm def path.
    Object.keys(farmDefSiteObject.interfaces).forEach(interfaceName => {
      const interfaceObj = farmDefSiteObject.interfaces[interfaceName];
      Object.keys(interfaceObj.methods).forEach(methodName => {
        const method = interfaceObj.methods[methodName];
        const operationName = operationNamesToFind.find(operationName => operationName === method.name);
        if (operationName && method.path && method.type === methodType) {
          operationPaths.set(operationName, method.path);
        }
      });
    });
  }

  return { isLoading, operationPaths };
}
