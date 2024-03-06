import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { DateTimeFormat, getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { mockBaseObservationDefinitions } from '../common/test-helpers';
import { getWindowDurationLabel } from '../common/utils';
import { PATHS } from '../paths';

import { BaseObservationDefinitionPage, dataTestIdsBaseObservationDefinitionPage as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const [definition] = mockBaseObservationDefinitions;

describe('BaseObservationDefinitionPage', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const history = createMemoryHistory({ initialEntries: [PATHS.baseObservationDefinitionPage('mock-id')] });

    const { queryByTestId } = render(
      <Router history={history}>
        <Route path={PATHS.baseObservationDefinitionPage(':definitionId')} component={BaseObservationDefinitionPage} />
      </Router>
    );

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.streamName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.lastUpdatedAtBy)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.path)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.observationName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.window)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.comment)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.output)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.aggregation)).not.toBeInTheDocument();
  });

  it('renders the definition', () => {
    mockUseSwrAxios.mockReturnValue({ data: definition, isValidating: false });

    const history = createMemoryHistory({ initialEntries: [PATHS.baseObservationDefinitionPage(definition.id)] });

    const { queryByTestId } = render(
      <Router history={history}>
        <Route path={PATHS.baseObservationDefinitionPage(':definitionId')} component={BaseObservationDefinitionPage} />
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
    expect(queryByTestId(dataTestIds.comment)).toHaveTextContent(definition.comment);
    expect(queryByTestId(dataTestIds.output)).toHaveTextContent(definition.output);
    expect(queryByTestId(dataTestIds.aggregation)).toHaveTextContent(definition.aggregation);
  });
});
