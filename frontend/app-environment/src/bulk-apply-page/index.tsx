import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { AppBreadcrumbs, AppHeader, AppLayout, Show, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePostRequest, useRedisJsonObjectApi, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { BulkApplyWorkflow, Metric } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PATHS } from '../paths';

import { BulkApplyChoose, BulkApplyComplete, dataTestIdsBulkApplyChoose } from './components';

interface BulkApplyRequestBody {
  templateMetricId: string;
  otherMetricIds: string[];
  updatedBy: string;
}

const dataTestIds = {
  bulkApplyComplete: 'bulkApplyComplete',
  loader: 'loader',
  choose: dataTestIdsBulkApplyChoose,
};

export { dataTestIds as dataTestIdsBulkApplyPage };

export interface BulkApplyPageUrlParams {
  redisObjectId: string;
}

/**
 * This page pulls a list of Metric IDs stored in redis under the `redisObjectId` key.
 *
 * Users can choose a Metric and apply its configuration to other Metrics.
 *
 * - The first step of the workflow is implemented in <BulkApplyChoose/>
 * - The second (and last) step of the workflow is implemented in <BulkApplyComplete/>
 */
export const BulkApplyPage: React.FC<RouteComponentProps<BulkApplyPageUrlParams>> = ({ match }) => {
  const { redisObjectId } = match.params;
  const { redisJsonObject, isLoading: isLoadingRedisJsonObject } =
    useRedisJsonObjectApi<BulkApplyWorkflow>(redisObjectId);
  const { data: metrics, isValidating } = useSwrAxios<PaginatedList<Metric>>(
    redisJsonObject && {
      url: EVS_URLS.metrics.searchUrl(),
      method: 'POST',
      data: { ids: redisJsonObject.value.metricIds, includeAlertRules: true },
    }
  );
  const { makeRequest, isLoading: isBulkApplying } = usePostRequest<never, BulkApplyRequestBody>({
    url: EVS_URLS.metrics.bulkApplyUrl(),
  });
  const [coreStore] = useCoreStore();
  const [isBulkApplyComplete, setIsBulkApplyComplete] = React.useState<boolean>(false);
  const snackbar = useGlobalSnackbar();

  const isLoading = isLoadingRedisJsonObject || isValidating;

  /** Apply the selected Metric configuration (min/max + AlertRules' config) to all other Metrics. */
  const handleBulkApply: BulkApplyChoose['onBulkApply'] = templateMetric => {
    makeRequest({
      data: {
        templateMetricId: templateMetric.id,
        otherMetricIds: metrics.data.filter(metric => metric.id !== templateMetric.id).map(metric => metric.id),
        updatedBy: coreStore.currentUser.username,
      },
      onSuccess: () => {
        setIsBulkApplyComplete(true);
      },
      onError: error => {
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ message });
      },
    });
  };

  return (
    <AppLayout isLoading={isLoading || isBulkApplying}>
      <AppHeader>
        <AppBreadcrumbs homePageRoute={PATHS.metricsPage} homePageName="Bulk Apply" marginLeft="0.75rem" />
      </AppHeader>

      <Show
        when={!isLoading}
        fallback={
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <CircularProgress size="2rem" data-testid={dataTestIds.loader} />
          </Box>
        }
      >
        <Show
          when={!isBulkApplyComplete}
          fallback={<BulkApplyComplete metrics={metrics?.data} data-testid={dataTestIds.bulkApplyComplete} />}
        >
          <BulkApplyChoose metrics={metrics?.data} onBulkApply={handleBulkApply} isBulkApplying={isBulkApplying} />
        </Show>
      </Show>
    </AppLayout>
  );
};
