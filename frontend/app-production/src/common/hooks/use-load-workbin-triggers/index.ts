import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { WorkbinTaskTrigger, WorkbinTaskTriggerFilter } from '../../types/workspace';

const WORKBINS_TRIGGERS_FILTER_URL = '/api/plentyservice/workbin-service/filter-workbin-task-group';

export interface UseLoadWorkbinTaskTriggerReturn {
  clearData: () => void;
  loadData: (filterData: WorkbinTaskTriggerFilter) => void;
  workbinTaskTriggers: WorkbinTaskTrigger[];
  isLoading: boolean;
}

export const useLoadWorkbinTriggers = (): UseLoadWorkbinTaskTriggerReturn => {
  const snackbar = useGlobalSnackbar();
  const { makeRequest, isLoading } = usePostRequest<WorkbinTaskTrigger[], WorkbinTaskTriggerFilter>({
    url: WORKBINS_TRIGGERS_FILTER_URL,
  });
  const [workbinTaskTriggers, setWorkbinTaskTriggers] = React.useState<WorkbinTaskTrigger[]>([]);

  function clearData() {
    setWorkbinTaskTriggers([]);
  }

  function loadData(filterData: WorkbinTaskTriggerFilter) {
    makeRequest({
      data: filterData,
      onSuccess: (responseData: WorkbinTaskTrigger[]) => setWorkbinTaskTriggers(responseData),
      onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
    });
  }

  return {
    clearData,
    loadData,
    workbinTaskTriggers,
    isLoading,
  };
};
