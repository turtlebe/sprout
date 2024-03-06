import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import { Router } from 'react-router-dom';

import { QueryParameters } from '../../types';

import { QueryParameterProvider, useQueryParameter } from './index';

const mapsPath = '/production/maps/interactive';

describe('useQueryParameter', () => {
  function renderUseQueryParameterHook(defaultParameters: QueryParameters, initialEntry?: string) {
    const history = createMemoryHistory({ initialEntries: [initialEntry || mapsPath] });

    const result = renderHook(() => useQueryParameter(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <QueryParameterProvider defaultParameters={defaultParameters}>{children}</QueryParameterProvider>
        </Router>
      ),
    });

    return { history, ...result };
  }

  it('returns the default "parameters" when no values are in query string', () => {
    const { result } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    expect(result.current.parameters).toEqual(mockDefaultQueryParameters);
  });

  it('returns the "parameters" with values from the query string', () => {
    const { result } = renderUseQueryParameterHook(mockDefaultQueryParameters, `${mapsPath}?selectedCrops=WHC`);
    expect(result.current.parameters).toEqual({ ...mockDefaultQueryParameters, selectedCrops: ['WHC'] });
  });

  it('serializes and deserializes the "ageCohortDate" correctly', () => {
    // deserialize to 'all' value
    const { result } = renderUseQueryParameterHook(mockDefaultQueryParameters, `${mapsPath}?ageCohortDate=all`);
    expect(result.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      ageCohortDate: DEFAULT_AGE_COHORT_DATE,
    });

    // deserialize to a date
    const mockAgeCohortDate = DateTime.fromISO('2022-11-01T08:00:00.000Z').toJSDate();
    const { result: result2 } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?ageCohortDate=${mockAgeCohortDate.toISOString()}`
    );
    expect(result2.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      ageCohortDate: mockAgeCohortDate,
    });

    // serialize to 'all' value
    const { result: result3 } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    act(() => {
      result3.current.setParameters({ ageCohortDate: DEFAULT_AGE_COHORT_DATE });
    });
    expect(result3.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      ageCohortDate: DEFAULT_AGE_COHORT_DATE,
    });

    // serialize to a date
    const { result: result4 } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    act(() => {
      result4.current.setParameters({ ageCohortDate: mockAgeCohortDate });
    });
    expect(result4.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      ageCohortDate: mockAgeCohortDate,
    });

    // deserialize fails when given invalid date, uses default parameters value.
    const { result: result5 } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?ageCohortDate=invalid`
    );
    expect(result5.current.parameters).toEqual(mockDefaultQueryParameters);
  });

  it('serializes and deserializes the "selectedDate" correctly', () => {
    // deserialize to a date
    const mockSelectedDate = DateTime.fromISO('2022-11-01T08:00:00.000Z');
    const { result } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?selectedDate=${mockSelectedDate.toUTC().toISO()}`
    );
    expect(result.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedDate: mockSelectedDate,
    });

    // serialize to a date
    const { result: result2 } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    act(() => {
      result2.current.setParameters({ selectedDate: mockSelectedDate });
    });
    expect(result2.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedDate: mockSelectedDate,
    });

    // deserialize fails when given invalid date, uses default parameters value.
    const { result: result3 } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?selectedDate=invalid`
    );
    expect(result3.current.parameters).toEqual(mockDefaultQueryParameters);
  });

  it('serializes and deserializes the "selectedCrops" correctly', () => {
    // deserialize to a array of crops
    const mockSelectedCrops = ['WHC', 'BAC'];
    const { result } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?selectedCrops=${mockSelectedCrops[0]}&selectedCrops=${mockSelectedCrops[1]}`
    );
    expect(result.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedCrops: mockSelectedCrops,
    });

    // serialize selectedCrops
    const { result: result2 } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    act(() => {
      result2.current.setParameters({ selectedCrops: mockSelectedCrops });
    });
    expect(result2.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      selectedCrops: mockSelectedCrops,
    });
  });

  function expectToSerializesAndDeserializesBooleanCorrectly(parameterName: string) {
    // deserialize true value
    const { result } = renderUseQueryParameterHook(mockDefaultQueryParameters, `${mapsPath}?${parameterName}=1`);
    expect(result.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      [parameterName]: true,
    });

    // deserialize false value
    const { result: result2 } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?${parameterName}=0`
    );
    expect(result2.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      [parameterName]: false,
    });

    // serialize true value
    const { result: result3 } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    act(() => {
      result3.current.setParameters({ [parameterName]: true });
    });
    expect(result3.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      [parameterName]: true,
    });

    // serialize false value
    const { result: result4 } = renderUseQueryParameterHook(mockDefaultQueryParameters);
    act(() => {
      result4.current.setParameters({ [parameterName]: false });
    });
    expect(result4.current.parameters).toEqual({
      ...mockDefaultQueryParameters,
      [parameterName]: false,
    });
  }

  it('serializes and deserializes the "showSerials" correctly', () => {
    expectToSerializesAndDeserializesBooleanCorrectly('showSerials');
  });

  it('serializes and deserializes the "showIrrigationLayer" correctly', () => {
    expectToSerializesAndDeserializesBooleanCorrectly('showIrrigationLayer');
  });

  it('serializes and deserializes the "showCommentsLayer" correctly', () => {
    expectToSerializesAndDeserializesBooleanCorrectly('showCommentsLayer');
  });

  it('resets the selected query parameters to default values, keeping other query parameters', () => {
    const { history, result } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?showSerials=1&showIrrigationLayer=1&showCommentsLayer=1&whatever=1`
    );

    act(() => {
      result.current.resetParameters(['showSerials', 'showIrrigationLayer']);
    });

    expect(result.current.parameters).toEqual({ ...mockDefaultQueryParameters, showCommentsLayer: true });
    expect(history.location.search).toEqual('?showCommentsLayer=1&whatever=1');
  });

  it('removes the all of the query parameters defined in "QueryParamters", keeping other query parameters', () => {
    const mockAgeCohortDate = DateTime.fromISO('2022-11-01T08:00:00.000Z').toJSDate();
    const mockSelectedDate = DateTime.fromISO('2022-11-02T08:00:00.000Z');
    const { history, result } = renderUseQueryParameterHook(
      mockDefaultQueryParameters,
      `${mapsPath}?whatever=1&showSerials=1&showIrrigationLayer=1&showCommentsLayer=1&selectedCrops=WHC&ageCohortDate=${mockAgeCohortDate.toISOString()}&selectedDate=${mockSelectedDate.toISO()}`
    );

    act(() => {
      result.current.resetAllParameters();
    });

    expect(result.current.parameters).toEqual(mockDefaultQueryParameters);
    expect(history.location.search).toEqual('?whatever=1');
  });
});
