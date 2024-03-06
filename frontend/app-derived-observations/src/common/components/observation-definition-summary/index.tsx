import { getWindowDurationLabel } from '@plentyag/app-derived-observations/src/common/utils';
import { Card, CardItem } from '@plentyag/brand-ui/src/components';
import { Box, Link, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import {
  BaseObservationDefinition,
  DerivedObservationDefinition,
  SourceObservationDefinition,
} from '@plentyag/core/src/types/derived-observations';
import { isBaseObservationDefinition } from '@plentyag/core/src/types/derived-observations/type-guards';
import { getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  streamName: 'observation-definition-summary-stream-name',
  path: 'observation-definition-summary-path',
  observationName: 'observation-definition-summary-observation-name',
  window: 'observation-definition-summary-window',
  comment: 'observation-definition-summary-comment',
  output: 'observation-definition-summary-output',
  aggregation: 'observation-definition-summary-aggregation',
  sourceStreamNames: 'observation-definition-summary-source-stream-names',
  sourceStreamName: (sourceStreamName: string) =>
    `observation-definition-summary-source-stream-names-${sourceStreamName}`,
  sourceStreamNameLink: (sourceStreamName: string) =>
    `observation-definition-summary-source-stream-names-link-${sourceStreamName}`,
  expression: 'observation-definition-summary-expression',
  measurementType: 'observation-definition-summary-measurement-type',
  measurementUnit: 'observation-definition-summary-measurement-unit',
};

export { dataTestIds as dataTestIdsObservationDefinitionSummary };

type AttributeName =
  | keyof BaseObservationDefinition
  | keyof DerivedObservationDefinition
  | keyof SourceObservationDefinition
  | keyof SourceObservationDefinition['observationKey'];

export interface ObservationDefinitionSummary {
  definition: BaseObservationDefinition | DerivedObservationDefinition;
  selectedDependency?: BaseObservationDefinition | DerivedObservationDefinition;
  isLoading?: boolean;
  title: string;
  attributes?: AttributeName[];
  onSelectDependency?: (sourceStreamName: string) => void;
  classes?: Card['classes'];
}

/**
 * Generic component to display attributes of a Base or Derived ObservationDefinition.
 */
export const ObservationDefinitionSummary: React.FC<ObservationDefinitionSummary> = ({
  definition,
  title,
  isLoading = false,
  attributes = [],
  selectedDependency,
  onSelectDependency,
  classes: classesProp,
}) => {
  const classes = useStyles({});

  const hasAttribute = React.useCallback(
    (attributeName: AttributeName) => attributes.includes(attributeName) || attributes.length === 0,
    []
  );

  if (!definition) {
    return null;
  }

  if (isBaseObservationDefinition(definition)) {
    return (
      <Card title={title} isLoading={isLoading} classes={classesProp}>
        {hasAttribute('streamName') && (
          <CardItem name="Stream Name">
            <Typography data-testid={dataTestIds.streamName}>{definition.streamName}</Typography>
          </CardItem>
        )}
        {hasAttribute('path') && (
          <CardItem name="Path">
            <Typography data-testid={dataTestIds.path}>{getShortenedPath(definition?.observationKey?.path)}</Typography>
          </CardItem>
        )}
        {hasAttribute('observationName') && (
          <CardItem name="Observation Name">
            <Typography data-testid={dataTestIds.observationName}>
              {definition?.observationKey?.observationName}
            </Typography>
          </CardItem>
        )}
        {hasAttribute('window') && (
          <CardItem name="Window">
            <Typography data-testid={dataTestIds.window}>{getWindowDurationLabel(definition?.window)}</Typography>
          </CardItem>
        )}
        {hasAttribute('comment') && (
          <CardItem name="Comment">
            <Typography data-testid={dataTestIds.comment}>{definition?.comment}</Typography>
          </CardItem>
        )}
        {hasAttribute('output') && (
          <CardItem name="Output Type">
            <Typography data-testid={dataTestIds.output}>{definition?.output}</Typography>
          </CardItem>
        )}
        {hasAttribute('aggregation') && (
          <CardItem name="Aggregaton">
            <Typography data-testid={dataTestIds.aggregation}>{definition?.aggregation}</Typography>
          </CardItem>
        )}
      </Card>
    );
  } else {
    return (
      <Card title={title} isLoading={isLoading} classes={classesProp}>
        {hasAttribute('streamName') && (
          <CardItem name="Stream Name">
            <Typography data-testid={dataTestIds.streamName}>{definition.streamName}</Typography>
          </CardItem>
        )}
        {hasAttribute('sourceStreamNames') && (
          <CardItem name="Source Stream Names">
            <Box data-testid={dataTestIds.sourceStreamNames}>
              {definition?.sourceStreamNames?.map(sourceStreamName => (
                <Typography key={sourceStreamName} data-testid={dataTestIds.sourceStreamName(sourceStreamName)}>
                  {onSelectDependency ? (
                    <Link
                      className={
                        selectedDependency?.streamName === sourceStreamName
                          ? classes.dependencyLinkActive
                          : classes.dependencyLink
                      }
                      data-testid={dataTestIds.sourceStreamNameLink(sourceStreamName)}
                      onClick={() => onSelectDependency(sourceStreamName)}
                    >
                      {sourceStreamName}
                    </Link>
                  ) : (
                    sourceStreamName
                  )}
                </Typography>
              ))}
            </Box>
          </CardItem>
        )}
        {hasAttribute('expression') && (
          <CardItem name="Expression">
            <Box data-testid={dataTestIds.expression} className={classes.expression}>
              {definition?.expression}
            </Box>
          </CardItem>
        )}
        {hasAttribute('window') && (
          <CardItem name="Window">
            <Typography data-testid={dataTestIds.window}>{getWindowDurationLabel(definition?.window)}</Typography>
          </CardItem>
        )}
        {hasAttribute('path') && (
          <CardItem name="Path">
            <Typography data-testid={dataTestIds.path}>{getShortenedPath(definition?.observationKey?.path)}</Typography>
          </CardItem>
        )}
        {hasAttribute('observationName') && (
          <CardItem name="Observation Name">
            <Typography data-testid={dataTestIds.observationName}>
              {definition?.observationKey?.observationName}
            </Typography>
          </CardItem>
        )}
        {hasAttribute('outputMeasurementType') && (
          <CardItem name="Measurement Type">
            <Typography data-testid={dataTestIds.measurementType}>{definition?.outputMeasurementType}</Typography>
          </CardItem>
        )}
        {hasAttribute('outputMeasurementTypeUnits') && (
          <CardItem name="Measurement Unit">
            <Typography data-testid={dataTestIds.measurementUnit}>{definition?.outputMeasurementTypeUnits}</Typography>
          </CardItem>
        )}
        {hasAttribute('output') && (
          <CardItem name="Output">
            <Typography data-testid={dataTestIds.output}>{definition?.output}</Typography>
          </CardItem>
        )}
      </Card>
    );
  }
};
