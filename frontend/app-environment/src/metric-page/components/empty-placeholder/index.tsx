import { ErrorOutline } from '@material-ui/icons';
import { ButtonCreateAlertRule } from '@plentyag/app-environment/src/common/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface EmptyPlaceholder {
  metric: Metric;
  onAlertRuleCreated: () => void;
}

/**
 * Empty Placeholder when a Metric doesn't have any AlertRule.
 *
 * This placeholder offers a CTA to initiate creating the first AlertRule on the Metric.
 */
export const EmptyPlaceholder: React.FC<EmptyPlaceholder> = ({ metric, onAlertRuleCreated }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="100%">
      <Box display="flex" marginBottom={2}>
        <ErrorOutline />
        <Box padding={0.25} />
        <Typography>No Alert Rules.</Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <ButtonCreateAlertRule metric={metric} onSuccess={onAlertRuleCreated} color="primary" variant="contained" />
      </Box>
    </Box>
  );
};
