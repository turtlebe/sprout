import { PATHS } from '@plentyag/app-derived-observations/src/paths';
import { AppBreadcrumbs, AppHeader, AppLayout } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { BaseObservationDefinition, DerivedObservationDefinition } from '@plentyag/core/src/types/derived-observations';
import { isBaseObservationDefinition } from '@plentyag/core/src/types/derived-observations/type-guards';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { dataTestIdsObservationDefinitionSummary, ObservationDefinitionSummary } from '../common/components';

import { useStyles } from './styles';

const dataTestIds = {
  loader: 'base-observation-definition-page-loader',
  streamName: 'base-observation-definition-page-stream-name',
  lastUpdatedAtBy: 'base-observation-definition-page-last-updated-at-by',
  ...dataTestIdsObservationDefinitionSummary,
};

export { dataTestIds as dataTestIdsDerivedObservationDefinitionPage };

const getDerivedObservationDefinitionUrl = (definitionId: string) =>
  `/api/swagger/environment-service/derived-observation-definitions-api/get-derived-observation-definition-by-id/${definitionId}?includeDependents=true&includeDependencies=true`;

export interface DerivedObservationDefinitionPageUrlParams {
  definitionId: string;
}

/**
 * Page that renders a DerivedObservationDefinition.
 *
 * Users can click on each sourceStreamName and display the definition dependency.
 */
export const DerivedObservationDefinitionPage: React.FC<
  RouteComponentProps<DerivedObservationDefinitionPageUrlParams>
> = ({ match }) => {
  const { definitionId } = match.params;

  const classes = useStyles({});
  const [dependency, setDependency] = React.useState<BaseObservationDefinition | DerivedObservationDefinition>();
  const { data: definition, isValidating } = useSwrAxios<DerivedObservationDefinition>({
    url: getDerivedObservationDefinitionUrl(definitionId),
  });

  const handleSelectDependency = (sourceStreamName: string) => {
    if (!definition || !definition.dependencies) {
      return;
    }

    setDependency(definition.dependencies.find(dependency => dependency.streamName === sourceStreamName));
  };

  return (
    <AppLayout isLoading={isValidating}>
      <AppHeader flexDirection="column">
        <AppBreadcrumbs
          homePageRoute={PATHS.derivedObservationDefinitionsPage}
          homePageName="Derived Observation Definition"
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ObservationDefinitionSummary
                  title="Sources"
                  definition={definition}
                  isLoading={isValidating}
                  attributes={['sourceStreamNames', 'expression', 'window']}
                  selectedDependency={dependency}
                  onSelectDependency={handleSelectDependency}
                />
              </Grid>
              <Grid item xs={12}>
                <ObservationDefinitionSummary
                  title="Output"
                  definition={definition}
                  isLoading={isValidating}
                  attributes={[
                    'path',
                    'observationName',
                    'outputMeasurementType',
                    'outputMeasurementTypeUnits',
                    'output',
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            {dependency && (
              <ObservationDefinitionSummary
                title={
                  isBaseObservationDefinition(dependency)
                    ? 'BaseObservationDefinition Dependency'
                    : 'DerivedObservationDefinition Dependency'
                }
                definition={dependency}
                classes={{ card: classes.dependencyCard }}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};
