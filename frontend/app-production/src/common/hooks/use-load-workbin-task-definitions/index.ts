import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { WorkbinTaskDefinition, WorkbinTaskDefinitionFilter } from '../../types/workspace';

const WORKBINS_DEFINITION_FILTER_URL = '/api/plentyservice/workbin-service/filter-workbin-task-definitions';

export interface UseLoadWorkbinTaskDefinitionsReturn {
  clearData: () => void;
  loadData: (filterData: WorkbinTaskDefinitionFilter) => void;
  workbinTaskDefinitions: WorkbinTaskDefinition[];
  isLoading: boolean;
}

export const useLoadWorkbinTaskDefinitions = (): UseLoadWorkbinTaskDefinitionsReturn => {
  const snackbar = useGlobalSnackbar();
  const { makeRequest, isLoading } = usePostRequest<WorkbinTaskDefinition[], WorkbinTaskDefinitionFilter>({
    url: WORKBINS_DEFINITION_FILTER_URL,
  });
  const [workbinTaskDefinitions, setWorkbinTaskDefinitions] = React.useState<WorkbinTaskDefinition[]>([]);

  function clearData() {
    setWorkbinTaskDefinitions([]);
  }

  function loadData(filterData: WorkbinTaskDefinitionFilter) {
    makeRequest({
      data: filterData,
      onSuccess: (responseData: WorkbinTaskDefinition[]) => setWorkbinTaskDefinitions(responseData),
      onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
    });
  }

  return {
    clearData,
    loadData,
    workbinTaskDefinitions,
    isLoading,
  };
};
