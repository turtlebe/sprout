import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { mockBaseObservationDefinitions, mockDerivedObservationDefinitions } from '../../test-helpers';
import { getWindowDurationLabel } from '../../utils';

import { dataTestIdsObservationDefinitionSummary as dataTestIds, ObservationDefinitionSummary } from '.';

const [baseDefinition] = mockBaseObservationDefinitions;
const [derivedDefinition] = mockDerivedObservationDefinitions;

describe('ObservationDefinitionSummary', () => {
  it('renders a BaseObservationDefinitions with all its attributes', () => {
    const { container, queryByTestId } = render(
      <ObservationDefinitionSummary title="Title" definition={baseDefinition} />
    );

    expect(container).toHaveTextContent('Title');
    expect(queryByTestId(dataTestIds.streamName)).toHaveTextContent(baseDefinition.streamName);
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(baseDefinition.observationKey.path));
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(baseDefinition.observationKey.observationName);
    expect(queryByTestId(dataTestIds.window)).toHaveTextContent(getWindowDurationLabel(baseDefinition.window));
    expect(queryByTestId(dataTestIds.output)).toHaveTextContent(baseDefinition.output);
    expect(queryByTestId(dataTestIds.comment)).toHaveTextContent(baseDefinition.comment);
    expect(queryByTestId(dataTestIds.aggregation)).toHaveTextContent(baseDefinition.aggregation);
  });

  it('renders a BaseObservationDefinitions with certain attributes', () => {
    const { container, queryByTestId } = render(
      <ObservationDefinitionSummary title="Title" definition={baseDefinition} attributes={['streamName', 'path']} />
    );

    expect(container).toHaveTextContent('Title');
    expect(queryByTestId(dataTestIds.streamName)).toHaveTextContent(baseDefinition.streamName);
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(baseDefinition.observationKey.path));
    expect(queryByTestId(dataTestIds.observationName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.window)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.output)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comment)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.aggregation)).not.toBeInTheDocument();
  });

  it('renders a DerivedObservationDefinitions with all its attributes', () => {
    const { container, queryByTestId } = render(
      <ObservationDefinitionSummary title="Title" definition={derivedDefinition} />
    );

    expect(container).toHaveTextContent('Title');
    expect(queryByTestId(dataTestIds.streamName)).toHaveTextContent(derivedDefinition.streamName);
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(derivedDefinition.observationKey.path));
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(
      derivedDefinition.observationKey.observationName
    );
    expect(queryByTestId(dataTestIds.window)).toHaveTextContent(getWindowDurationLabel(derivedDefinition.window));
    expect(queryByTestId(dataTestIds.output)).toHaveTextContent(derivedDefinition.output);
    expect(queryByTestId(dataTestIds.sourceStreamNames)).toBeInTheDocument();
    derivedDefinition.sourceStreamNames.forEach(sourceStreamName => {
      expect(queryByTestId(dataTestIds.sourceStreamName(sourceStreamName))).toHaveTextContent(sourceStreamName);
      expect(queryByTestId(dataTestIds.sourceStreamNameLink(sourceStreamName))).not.toBeInTheDocument();
    });
    expect(queryByTestId(dataTestIds.expression)).toHaveTextContent(derivedDefinition.expression);
    expect(queryByTestId(dataTestIds.measurementType)).toHaveTextContent(derivedDefinition.outputMeasurementType);
    expect(queryByTestId(dataTestIds.measurementUnit)).toHaveTextContent(derivedDefinition.outputMeasurementTypeUnits);
  });

  it('renders a DerivedObservationDefinitions with certain attributes', () => {
    const { container, queryByTestId } = render(
      <ObservationDefinitionSummary title="Title" definition={derivedDefinition} attributes={['streamName', 'path']} />
    );

    expect(container).toHaveTextContent('Title');
    expect(queryByTestId(dataTestIds.streamName)).toHaveTextContent(derivedDefinition.streamName);
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(derivedDefinition.observationKey.path));
    expect(queryByTestId(dataTestIds.observationName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.window)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.output)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.sourceStreamNames)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expression)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.measurementType)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.measurementUnit)).not.toBeInTheDocument();
  });

  it('renders a DerivedObservationDefinitions with a callback when clicking on SourceStreamNames', () => {
    const onSelectDependency = jest.fn();

    const { queryByTestId } = render(
      <ObservationDefinitionSummary
        title="Title"
        definition={derivedDefinition}
        onSelectDependency={onSelectDependency}
      />
    );

    const [sourceStreamName] = derivedDefinition.sourceStreamNames;
    queryByTestId(dataTestIds.sourceStreamNameLink(sourceStreamName)).click();

    expect(onSelectDependency).toHaveBeenCalledWith(sourceStreamName);
  });
});
