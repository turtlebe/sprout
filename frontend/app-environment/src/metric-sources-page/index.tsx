import { ArrowBack } from '@material-ui/icons';
import { HeaderMetric } from '@plentyag/app-environment/src/common/components';
import { useFetchAndConvertMetric, useFetchAndConvertObservations } from '@plentyag/app-environment/src/common/hooks';
import { AppLayout, CircularProgressCentered, Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, Card, CardContent, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import moment from 'moment';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { DEFAULT_TIME_GRANULARITY } from '../common/utils/constants';
import { PATHS } from '../paths';

import { MetricSource } from './components';
import { getUniqSources } from './utils';

const dataTestIds = {
  loader: 'metric-sources-page-loader',
  backToMetricPage: 'metric-sources-page-back-to-metric-page',
  noSources: 'metric-sources-no-source',
  source: (observation: RolledUpByTimeObservation) =>
    `metric-sources-source-${observation.rolledUpAt}-${observation.observationName}`,
};

export { dataTestIds as dataTestIdsMetricSourcesPage };

export interface MetricSourcesUrlParams {
  metricId: string;
}

/**
 * Page displaying all the sources reporting the data of a Metric.
 */
export const MetricSourcesPage: React.FC<RouteComponentProps<MetricSourcesUrlParams>> = ({ match }) => {
  const { metricId } = match.params;

  const endDateTime = React.useMemo(() => moment().toDate(), []);
  const startDateTime = React.useMemo(() => moment(endDateTime).subtract(2, 'hours').toDate(), [endDateTime]);

  const { data: metric, isValidating: isLoadingMetric } = useFetchAndConvertMetric(metricId);
  const { data: observations = [], isLoading: isLoadingObservations } = useFetchAndConvertObservations({
    metric,
    startDateTime,
    endDateTime,
    timeGranularity: DEFAULT_TIME_GRANULARITY,
    includeSources: true,
  });
  const isLoading = isLoadingMetric || isLoadingObservations;
  const sources = React.useMemo(() => getUniqSources(observations), [observations]);

  return (
    <AppLayout isLoading={isLoading}>
      <HeaderMetric metric={metric} isLoading={Boolean(isLoadingObservations && !metric)}>
        <Box display="flex" justifyContent="flex-end">
          <Link to={PATHS.metricPage(metric?.id)} style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<ArrowBack />} data-testid={dataTestIds.backToMetricPage}>
              Back to Metric Page
            </Button>
          </Link>
        </Box>
      </HeaderMetric>

      <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
        <Box padding={2}>
          <Card>
            <CardContent>
              <Show
                when={sources.length > 0}
                fallback={
                  <Typography data-testid={dataTestIds.noSources}>
                    No sources have reported data for this Metric in the last 2 hours.
                  </Typography>
                }
              >
                {sources.map(observation => (
                  <MetricSource
                    key={observation.rolledUpAt}
                    observation={observation}
                    data-testid={dataTestIds.source(observation)}
                  />
                ))}
              </Show>
            </CardContent>
          </Card>
        </Box>
      </Show>
    </AppLayout>
  );
};
