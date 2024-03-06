import { useSwrAxios } from '@plentyag/core/src/hooks';
import { DateTimeFormat, getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { mockDerivedObservationDefinitions } from '../common/test-helpers';
import { getWindowDurationLabel } from '../common/utils';
import { PATHS } from '../paths';

import { dataTestIdsDerivedObservationDefinitionPage as dataTestIds, DerivedObservationDefinitionPage } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const [definition] = mockDerivedObservationDefinitions;

describe('DerivedObservationDefinitionPage', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const history = createMemoryHistory({ initialEntries: [PATHS.derivedObservationDefinitionPage('mock-id')] });

    const { queryByTestId } = render(
      <Router history={history}>
        <Route
          path={PATHS.derivedObservationDefinitionPage(':definitionId')}
          component={DerivedObservationDefinitionPage}
        />
      </Router>
    );

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.streamName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.lastUpdatedAtBy)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.path)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.observationName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.window)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.output)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.sourceStreamNames)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expression)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.measurementType)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.measurementUnit)).not.toBeInTheDocument();
  });

  it('renders the definition', () => {
    mockUseSwrAxios.mockReturnValue({ data: definition, isValidating: false });

    const history = createMemoryHistory({ initialEntries: [PATHS.derivedObservationDefinitionPage(definition.id)] });

    const { queryByTestId } = render(
      <Router history={history}>
        <Route
          path={PATHS.derivedObservationDefinitionPage(':definitionId')}
          component={DerivedObservationDefinitionPage}
        />
      </Router>
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.streamName)).toHaveTextContent(definition.streamName);
    expect(queryByTestId(dataTestIds.lastUpdatedAtBy)).toHaveTextContent(
      DateTime.fromISO(definition.updatedAt).toFormat(DateTimeFormat.VERBOSE_DEFAULT)
    );
    expect(queryByTestId(dataTestIds.lastUpdatedAtBy)).toHaveTextContent(definition.updatedBy);
    const { path, observationName } = definition.observationKey;
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(getShortenedPath(path));
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(observationName);
    expect(queryByTestId(dataTestIds.window)).toHaveTextContent(getWindowDurationLabel(definition.window));
    expect(queryByTestId(dataTestIds.output)).toHaveTextContent(definition.output);
    expect(queryByTestId(dataTestIds.sourceStreamNames)).not.toBeEmptyDOMElement();
    definition.sourceStreamNames.forEach(sourceStreamName => {
      expect(queryByTestId(dataTestIds.sourceStreamName(sourceStreamName))).toHaveTextContent(sourceStreamName);
    });
    expect(queryByTestId(dataTestIds.expression)).toHaveTextContent(definition.expression);
    expect(queryByTestId(dataTestIds.measurementType)).toHaveTextContent(definition.outputMeasurementType);
    expect(queryByTestId(dataTestIds.measurementUnit)).toHaveTextContent(definition.outputMeasurementTypeUnits);
  });
});
