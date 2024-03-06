import { useFetchAndConvertObservations } from '@plentyag/app-environment/src/common/hooks';
import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import {
  buildAlertRule,
  buildMetric,
  buildRolledUpByTimeObservation,
} from '@plentyag/app-environment/src/common/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsWidgetLiveGroupMetric as dataTestIds, WidgetLiveGroupMetric } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observations');
jest.mock('@plentyag/core/src/hooks/use-fetch-measurement-types');

const mockUseFetchAndConvertObservations = useFetchAndConvertObservations as jest.Mock;
const metric = buildMetric({
  measurementType: 'TEMPERATURE',
  alertRules: [buildAlertRule({ rules: [{ time: 0, gte: -10, lte: 10 }] })],
});

function renderWidgetLiveGroupMetric({
  options = { alertRuleId: metric.alertRules[0].id },
}: Partial<WidgetLiveGroupMetric> = {}) {
  return render(
    <MemoryRouter>
      <WidgetLiveGroupMetric metric={metric} options={options} />
    </MemoryRouter>
  );
}

describe('WidgetLiveGroupMetric', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();

    jest.resetAllMocks();

    mockUseFetchAndConvertObservations.mockReturnValue({
      data: [buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:00:00Z', median: 0 })],
      isLoading: false,
    });

    mockUseFetchMeasurementTypes();
  });

  it('renders with a loader', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({ data: [], isLoading: true });

    const { queryByTestId } = renderWidgetLiveGroupMetric();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(metric.observationName);
  });

  it('renders the last observation', () => {
    const { queryByTestId } = renderWidgetLiveGroupMetric();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(metric.observationName);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('0 C');
  });

  it('renders the last observation without alert rule', () => {
    const { queryByTestId } = renderWidgetLiveGroupMetric({ options: {} });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(metric.observationName);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('0 C');
  });

  it('renders the last observation with unit conversion', () => {
    mockUseFetchAndConvertObservations.mockReturnValue({
      data: [buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:00:00Z', median: 32 })],
      isLoading: false,
    });

    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const { queryByTestId } = renderWidgetLiveGroupMetric();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.observationName)).toHaveTextContent(metric.observationName);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('32 F');
  });
});
