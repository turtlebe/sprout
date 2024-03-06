import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { AppHeader, AppLayout, BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useExtendedAgGridWithExpandableRows, usePostRequest } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import React, { useState } from 'react';

import { CreatePostharvestQaButton, PostharvestQaExpandedRow } from './components';
import { SEARCH_POSTHARVEST_AUDIT_SUMMARY, UPDATE_STATUS_URL } from './constants';
import { usePostharvestQaAgGridConfig } from './hooks';
import { useFetchPostharvestIngests } from './hooks/use-fetch-postharvest-ingests';

const dataTestIds = {
  root: 'postharvest-qa-root',
  displayName: 'postharvest-qa-display-name',
  loading: 'postharvest-qa-loading',
  create: 'postharvest-qa-create',
};

export { dataTestIds as dataTestIdsPostharvestQaFormPage };

export const PostharvestQaPage: React.FC = () => {
  const [{ currentUser }] = useCoreStore();
  const { username } = currentUser;
  const snackbar = useGlobalSnackbar();
  const { currentFarmDefPath } = currentUser;
  const siteName = getKindFromPath(currentFarmDefPath, 'sites');
  const farmName = getKindFromPath(currentFarmDefPath, 'farms');

  const [gridReadyEvent, setGridReadyEvent] = useState<GridReadyEvent>(null);

  const {
    postharvestIngestRecord,
    revalidate: revalidatePostharvestIngest,
    isLoading: isLoadingPostharvestIngests,
  } = useFetchPostharvestIngests({
    siteName,
    farmName,
  });

  const { makeRequest } = usePostRequest({
    url: UPDATE_STATUS_URL,
  });

  const agGridConfig = usePostharvestQaAgGridConfig({
    siteName,
    farmName,
    postharvestIngestRecord,
    onCreateIngest: result => {
      makeRequest({
        data: {
          author: username,
          status: result.status,
          notes: result.failureReason || 'Automatic Status Update',
          updatedAt: result.updatedAt,
        },
        url: `${UPDATE_STATUS_URL}/${result.lot}${toQueryParams({
          status_type: 'SKU_QA',
          net_suite_item: result.netSuiteItem,
        })}`,
        onSuccess: response => {
          snackbar.successSnackbar('Submitted audits and updated Finished Good lot status!', response);
        },
        onError: error => {
          let errorMessage = parseErrorMessage(error);
          snackbar.errorSnackbar({
            title:
              'Audits submitted successfully but there is an error while updating Finished Good lot status.\n Please update Finished Good lot status manually:',
            message: errorMessage,
          });
        },
      });
      void revalidatePostharvestIngest();
    },
  });
  const agGridConfigWithExpandableRows = useExtendedAgGridWithExpandableRows({
    agGridConfig,
    expandedRowHeight: 160,
    renderExpandableRow: row => {
      return (
        <PostharvestQaExpandedRow
          siteName={siteName}
          farmName={farmName}
          lotName={row.data.lot}
          skuName={row.data.sku}
        />
      );
    },
  });

  const handleSuccess = () => {
    gridReadyEvent.api.refreshServerSideStore({ purge: true });
  };

  const isLoading = isLoadingPostharvestIngests;

  return (
    <AppLayout data-testid={dataTestIds.root} isLoading={isLoading}>
      <AppHeader justifyContent="space-between">
        <Box pl={1}>
          <Typography variant="h5" data-testid={dataTestIds.displayName}>
            Post Harvest QA
          </Typography>
        </Box>
        <CreatePostharvestQaButton onSuccess={handleSuccess} siteName={siteName} farmName={farmName} />
      </AppHeader>
      <BaseAgGridInfiniteTable
        agGridConfig={agGridConfigWithExpandableRows}
        onGridReady={setGridReadyEvent}
        url={SEARCH_POSTHARVEST_AUDIT_SUMMARY}
        requestMethod="POST"
        extraData={{
          site: siteName,
          farm: farmName,
        }}
      />
    </AppLayout>
  );
};
