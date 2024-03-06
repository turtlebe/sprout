import { AssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { BaseAgGridClientSideTable, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React, { useEffect, useState } from 'react';

import { useAssesesmentTypesAgGridConfig } from '../../hooks/use-assessment-types-ag-grid-config';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'settings-table-root',
  loading: 'settings-table-loading',
};

export { dataTestIds as dataTestIdsSettingsTable };

export interface SettingsTable {
  isLoading: boolean;
  assessmentTypes: AssessmentTypes[];
  metricsRecord: Record<string, Metric>;
  onCreateMetric: () => void;
  onUpdatedAsssessmentType: () => void;
  onReorderAssessmentType: (assessmentTypes: AssessmentTypes[]) => void;
}

export const SettingsTable: React.FC<SettingsTable> = ({
  isLoading,
  assessmentTypes,
  metricsRecord,
  onCreateMetric = () => {},
  onUpdatedAsssessmentType = () => {},
  onReorderAssessmentType = () => {},
}) => {
  const classes = useStyles({});

  /**
   * The purpose of this handling of state is to manage only updating the displayed data
   * only when all server transactions are completed.  This means any emphermiral states in
   * the child components (i.e. ag grid) won't be overriden by parent data state. Without
   * this addition, AG Grid's drag and drop doesn't work as expected; the user would
   * drag-n-drop to change the order, and immediate you will see the table flip back to
   * it's previous data state until the new data gets refetched.
   */
  const [assessmentTypesState, setAssessmentTypesState] = useState(assessmentTypes);
  useEffect(() => {
    if (!isLoading && assessmentTypes?.length > 0) {
      setAssessmentTypesState(assessmentTypes);
    }
  }, [isLoading, assessmentTypes]);

  const agGridConfig = useAssesesmentTypesAgGridConfig({
    assessmentTypes: assessmentTypesState,
    metricsRecord,
    onCreateMetric,
    onUpdatedAsssessmentType,
    onReorderAssessmentType,
  });

  return (
    <Box className={classes.root} data-testid={dataTestIds.root}>
      <BaseAgGridClientSideTable agGridConfig={agGridConfig} />
      <Show when={isLoading}>
        <Box className={classes.loadingContainer}>
          <CircularProgressCentered data-testid={dataTestIds.loading} />
        </Box>
      </Show>
    </Box>
  );
};
