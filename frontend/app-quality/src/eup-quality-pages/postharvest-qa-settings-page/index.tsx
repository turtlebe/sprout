import { useFetchAssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/hooks';
import { AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { EditAssessmentTypeButton } from './components/edit-assessment-type-button';
import { SettingsTable } from './components/settings-table';
import { useAssessmentTypeUiReorder } from './hooks/use-assessment-types-ui-reorder';
import { useFetchPostharvestMetrics } from './hooks/use-fetch-postharvest-metrics';

const dataTestIds = {
  root: 'postharvest-qa-settings-root',
  displayName: 'postharvest-qa-settings-display-name',
  loading: 'postharvest-qa-settings-loading',
};

export { dataTestIds as dataTestIdsPostharvestQaSettingsPage };

export const PostharvestQaSettingsPage: React.FC = () => {
  const {
    assessmentTypes,
    revalidate: revalidateAssessmentTypes,
    isLoading: isLoadingAssessmentTypes,
  } = useFetchAssessmentTypes();
  const { metricsRecord, revalidate: revalidateMetrics, isLoading: isLoadingMetrics } = useFetchPostharvestMetrics();
  const { makeReorderRequest, isLoading: isLoadingAssessmentTypeUiReorder } = useAssessmentTypeUiReorder();

  const handleRefreshMetrics = async () => {
    return revalidateMetrics();
  };
  const handleRefreshAssessmentTypes = async () => {
    return revalidateAssessmentTypes();
  };
  const handleReorderAssessmentTypes = assessmentTypes => {
    return makeReorderRequest({
      assessmentTypes,
      onSuccess: revalidateAssessmentTypes,
      onError: revalidateAssessmentTypes,
    });
  };

  const isLoading = isLoadingAssessmentTypes || isLoadingMetrics || isLoadingAssessmentTypeUiReorder;

  return (
    <AppLayout data-testid={dataTestIds.root}>
      <AppHeader justifyContent="space-between">
        <Box pl={1}>
          <Typography variant="h5" data-testid={dataTestIds.displayName}>
            Post Harvest QA Settings
          </Typography>
        </Box>
        <EditAssessmentTypeButton onSuccess={handleRefreshAssessmentTypes} uiOrder={assessmentTypes.length + 1} />
      </AppHeader>
      <SettingsTable
        isLoading={isLoading}
        assessmentTypes={assessmentTypes}
        metricsRecord={metricsRecord}
        onCreateMetric={handleRefreshMetrics}
        onUpdatedAsssessmentType={handleRefreshAssessmentTypes}
        onReorderAssessmentType={handleReorderAssessmentTypes}
      />
    </AppLayout>
  );
};
