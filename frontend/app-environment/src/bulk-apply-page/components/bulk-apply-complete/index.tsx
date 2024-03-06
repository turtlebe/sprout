import { ArrowBack } from '@material-ui/icons';
import { LinkMetric } from '@plentyag/app-environment/src/common/components';
import { getColorGenerator } from '@plentyag/app-environment/src/common/utils';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { Card } from '@plentyag/brand-ui/src/components';
import { Box, Button, Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';
import { useHistory } from 'react-router-dom';

const dataTestIds = {
  linkToMetric: (metric: Metric) => `bulk-apply-complete-link-to-metric-${metric.id}`,
  linkToMetrics: 'bulk-apply-complete-link-to-metrics',
  root: 'bulk-apply-complete-root',
};

export { dataTestIds as dataTestIdsBulkApplyComplete };

export interface BulkApplyComplete {
  metrics: Metric[];
  'data-testid'?: string;
}

/**
 * Completion step of the BulkApply Workflow.
 *
 * This simply links each Metric to their respective page and provides a CTA to go back to the Metrics page.
 */
export const BulkApplyComplete: React.FC<BulkApplyComplete> = ({ metrics, 'data-testid': dataTestId }) => {
  const history = useHistory();
  const color = getColorGenerator();

  return (
    <Box padding={2} data-testid={dataTestId || dataTestIds.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card title="The following Metrics are now sharing the same configuration:" isLoading={false} doNotPadContent>
            <Box padding={2}>
              {metrics &&
                metrics.map((metric, index) => (
                  <Box
                    key={metric.id}
                    width="100%"
                    marginTop={index === 0 ? 0 : 2}
                    data-testid={dataTestIds.linkToMetric(metric)}
                  >
                    <LinkMetric key={metric.id} metric={metric} color={color.next().value[0]} />
                  </Box>
                ))}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => history.push(PATHS.metricsPage)}
              data-testid={dataTestIds.linkToMetrics}
            >
              Back to All Metrics
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
