import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { UnifiedWorkbinInstanceData, WorkbinTaskInstanceFilter } from '../../common/types';

const WORKBINS_INSTANCE_FILTER_URL = '/api/plentyservice/workbin-service/filter-workbin-task-instances';

interface UseLoadWorkbinInstancesReturn {
  loadData: (filterData: WorkbinTaskInstanceFilter) => void;
  clearData: () => void;
  unifiedWorkbinInstanceData: UnifiedWorkbinInstanceData[];
  isLoading: boolean;
}

export function useLoadWorkbinInstances(): UseLoadWorkbinInstancesReturn {
  const snackbar = useGlobalSnackbar();
  const { makeRequest, isLoading } = usePostRequest<UnifiedWorkbinInstanceData[], WorkbinTaskInstanceFilter>({
    url: WORKBINS_INSTANCE_FILTER_URL,
  });
  const [unifiedWorkbinInstanceData, setUnifiedWorkbinInstanceData] = React.useState<UnifiedWorkbinInstanceData[]>([]);

  function clearData() {
    setUnifiedWorkbinInstanceData([]);
  }

  function loadData(filterData: WorkbinTaskInstanceFilter) {
    makeRequest({
      data: filterData,
      onSuccess: (responseData: UnifiedWorkbinInstanceData[]) => {
        setUnifiedWorkbinInstanceData(responseData);
      },
      onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
    });
  }

  return {
    loadData,
    clearData,
    unifiedWorkbinInstanceData,
    isLoading,
  };
}
