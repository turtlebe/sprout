import { IGetRowsParams } from '@ag-grid-community/all-modules';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

import { SamplesResponseData, useLoadSamples } from '../../../common/hooks/use-load-samples';
import { processLabTestResults } from '../../../common/utils/process-lab-tests-result';
import { useGetSampleIdQueryParameter } from '../use-get-sample-id-query-parameter';

import { convertFilterModelIntoQueryParameters } from './convert-filter-model';
import { convertSortModelIntoQueryParameters } from './convert-sort-model';
import { createTableData } from './create-table-data';

export function useLoadRowData({
  labTestTypes,
  tableApi,
  containerRef,
  hasEditPermissions,
  username,
  onError,
  onSuccess,
}: {
  labTestTypes: LT.LabTestType[] | undefined;
  tableApi: LT.TableApi | undefined;
  containerRef: React.RefObject<HTMLDivElement>;
  hasEditPermissions: boolean;
  username: string;
  onError: (error: string) => void;
  onSuccess: (samples: LT.SampleResult[]) => void;
}) {
  const sampleIdQueryParameter = useGetSampleIdQueryParameter();

  const { isLoading: isLoadingRowData, error: errorLoadingRowData, makeRequest } = useLoadSamples();

  // given test: 'kind', 'provider' and 'sample type' --> test names.
  function getRowData(params: IGetRowsParams) {
    const pageSize = 100;
    const pageToLoad = 1 + params.startRow / pageSize;

    const orderBy = convertSortModelIntoQueryParameters(params.sortModel);

    const filterModel = sampleIdQueryParameter
      ? {
          lab_test_sample_id: {
            filter: sampleIdQueryParameter,
            filterType: 'text',
            type: 'contains',
          },
        }
      : params.filterModel;

    const filterParams = convertFilterModelIntoQueryParameters(filterModel);

    const queryParams = {
      page: pageToLoad,
      lab_tests_per_page: pageSize,
      order_by: orderBy,
      ...filterParams,
    };

    function onErrorLoading(errorResult: any) {
      params.failCallback();
      onError(parseErrorMessage(errorResult));
    }

    function onSuccessLoading(result: SamplesResponseData) {
      if (result.success && result.details && tableApi) {
        const samples = processLabTestResults(result);
        const lastRowNumber = result.details.total_lab_test_count;
        params.successCallback(
          createTableData({ data: samples, containerRef, tableApi, hasEditPermissions, username }),
          lastRowNumber
        );
        onSuccess(samples);
      } else {
        onErrorLoading(result);
      }
    }

    void makeRequest({
      queryParams,
      onSuccess: onSuccessLoading,
      onError: onErrorLoading,
    });
  }

  React.useEffect(() => {
    if (labTestTypes && labTestTypes.length > 0 && tableApi) {
      tableApi.gridApi.setDatasource({ getRows: getRowData });
    }
  }, [labTestTypes, tableApi, hasEditPermissions, sampleIdQueryParameter]);

  return { isLoadingRowData, errorLoadingRowData };
}
