import { PATHS } from '@plentyag/app-derived-observations/src/paths';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { BaseObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { dataTestIdsObservationDefinitionSummary, ObservationDefinitionSummary } from '../common/components';

const dataTestIds = {
  loader: 'base-observation-definition-page-loader',
  streamName: 'base-observation-definition-page-stream-name',
  lastUpdatedAtBy: 'base-observation-definition-page-last-updated-at-by',
  ...dataTestIdsObservationDefinitionSummary,
};

export { dataTestIds as dataTestIdsBaseObservationDefinitionPage };

const getBaseObservationDefinitionUrl = (definitionId: string) =>
  `/api/swagger/environment-service/derived-observation-definitions-api/get-base-observation-definition-by-id/${definitionId}?includeDependents=true`;

export interface BaseObservationDefinitionPageUrlParams {
  definitionId: string;
}

/**
 * Page that renders a BaseObservationDefinition.
 */
export const BaseObservationDefinitionPage: React.FC<RouteComponentProps<BaseObservationDefinitionPageUrlParams>> = ({
  match,
}) => {
  const { definitionId } = match.params;

  const { data: definition, isValidating } = useSwrAxios<BaseObservationDefinition>({
    url: getBaseObservationDefinitionUrl(definitionId),
  });

  return (
    <AppLayout isLoading={isValidating}>
      <AppHeader flexDirection="column">
        <AppBreadcrumbs
          homePageRoute={PATHS.baseObservationDefinitionsPage}
          homePageName="Base Observation Definition"
          pageName={isValidating ? ' --' : definition?.id}
          marginLeft="0.75rem"
        />
        <Box padding={1}>
          {isValidating ? (
            <CircularProgress size="12px" data-testid={dataTestIds.loader} />
          ) : (
            <Box>
              <Typography variant="h6" data-testid={dataTestIds.streamName}>
                Stream Name: {definition?.streamName}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" data-testid={dataTestIds.lastUpdatedAtBy}>
                Last updated at {getLuxonDateTime(definition?.updatedAt).toFormat(DateTimeFormat.VERBOSE_DEFAULT)} by{' '}
                {definition?.updatedBy}
              </Typography>
            </Box>
          )}
        </Box>
      </AppHeader>

      <Box padding={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ObservationDefinitionSummary
              title="Source"
              definition={definition}
              isLoading={isValidating}
              attributes={['path', 'observationName', 'window', 'comment']}
            />
          </Grid>
          <Grid item xs={6}>
            <ObservationDefinitionSummary
              title="Output"
              definition={definition}
              isLoading={isValidating}
              attributes={['output', 'aggregation']}
            />
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};
