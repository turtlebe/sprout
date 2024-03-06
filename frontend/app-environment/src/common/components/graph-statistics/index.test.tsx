import { useFetchAndConvertObservationStats } from '@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observation-stats';
import {
  buildRolledUpByTimeObservation,
  buildSchedule,
  buildScheduleDefinition,
  mockMetrics,
  mockObservationStats,
} from '@plentyag/app-environment/src/common/test-helpers';
import { DialogSchedulePicker } from '@plentyag/brand-ui/src/components';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { TimeSummarization, YAxisScaleType } from '@plentyag/core/src/types/environment';
import { act, render } from '@testing-library/react';
import * as d3 from 'd3';
import React from 'react';

import { dataTestIdsGraphStatistics, GraphStatistics } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observation-stats');
jest.mock('@plentyag/brand-ui/src/components/dialog-schedule-picker');

const dataTestIds = { ...dataTestIdsGraphStatistics, dialogSchedulePicker: 'dialogSchedulePicker' };
const observationStats = mockObservationStats;
const observations = [
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-03-20T01:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-03-20T02:00:00Z' }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2023-03-20T03:00:00Z' }),
];
const [metric] = mockMetrics;
const startDateTime = new Date('2023-03-20T00:00:00Z');
const endDateTime = new Date('2023-03-21T00:00:00Z');
const x = d3.scaleTime().domain([startDateTime, endDateTime]);
const y: d3.AxisScale<YAxisScaleType> = d3.scaleLinear().domain([0, 100]).range([0, 100]);
const schedule = buildSchedule({
  path: 'sites/TEST/scheduleDefinitions/SetTemperature',
  startsAt: '2023-01-01T00:00:00Z',
  actions: [
    { time: 3600, value: '10', valueType: 'SINGLE_VALUE' },
    { time: 3600 * 2, value: '20', valueType: 'SINGLE_VALUE' },
  ],
});
const scheduleDefinition = buildScheduleDefinition({
  path: 'sites/TEST/scheduleDefinitions/SetTemperature',
  actionDefinition: {
    from: 0,
    to: 100,
    measurementType: 'TEMPERATURE',
    graphable: true,
  },
});
const farmDefObject = { path: 'sites/TEST', scheduleDefinitions: { SetTemperature: scheduleDefinition } };

const mockUseFetchAndConvertObservationStats = useFetchAndConvertObservationStats as jest.Mock;
const MockDialogSchedulePicker = DialogSchedulePicker as jest.Mock;

mockUseFetchMeasurementTypes();

describe('GraphStatistics', () => {
  function renderGraphStatistics(props?: Partial<GraphStatistics>) {
    return render(
      <GraphStatistics
        isLoading={false}
        x={x}
        y={y}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metric={metric}
        observations={observations}
        timeSummarization={TimeSummarization.mean}
        {...props}
      />
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();

    MockDialogSchedulePicker.mockImplementation(({ onChange }) => (
      <button data-testid={dataTestIds.dialogSchedulePicker} onClick={() => onChange({ schedule, farmDefObject })} />
    ));
  });

  it('renders ObservationStats from RolledUpByTimeObservation by default', () => {
    mockUseFetchAndConvertObservationStats.mockReturnValue({
      primary: { isLoading: false, observationStats: undefined },
      secondary: [],
    });

    const { queryByTestId } = renderGraphStatistics();

    expect(queryByTestId(dataTestIds.rawDataSwitch).querySelector('input')).not.toBeChecked();
    expect(queryByTestId(dataTestIds.metricStats(metric).root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.metricStats(metric).loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.metricStats(metric).mean)).not.toHaveTextContent(observationStats.mean.toFixed(2));
  });

  it('filters out observations before the startDateTime', () => {
    mockUseFetchAndConvertObservationStats.mockReturnValue({
      primary: { isLoading: false, observationStats: undefined },
      secondary: [],
    });
    const { queryByTestId } = renderGraphStatistics({
      observations: [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T00:00:00Z' }), ...observations],
    });

    expect(queryByTestId(dataTestIds.metricStats(metric).count)).toHaveTextContent('3');
  });

  it('renders ObservationStats from the backend', () => {
    mockUseFetchAndConvertObservationStats.mockReturnValue({
      primary: { isLoading: false, observationStats },
      secondary: [],
    });

    const { queryByTestId } = renderGraphStatistics();

    expect(queryByTestId(dataTestIds.rawDataSwitch).querySelector('input')).not.toBeChecked();
    expect(queryByTestId(dataTestIds.metricStats(metric).count)).toHaveTextContent(observations.length.toString());

    act(() => queryByTestId(dataTestIds.rawDataSwitch).querySelector('input').click());

    expect(queryByTestId(dataTestIds.rawDataSwitch).querySelector('input')).toBeChecked();
    expect(queryByTestId(dataTestIds.metricStats(metric).count)).toHaveTextContent(observationStats.count.toString());
  });

  it('shows the stats as loading', () => {
    mockUseFetchAndConvertObservationStats.mockReturnValue({
      primary: { isLoading: false, observationStats },
      secondary: [],
    });

    const { queryByTestId } = renderGraphStatistics({ isLoading: true });

    expect(queryByTestId(dataTestIds.metricStats(metric).loader)).toBeInTheDocument();
  });

  it("renders ObservationStats for each schedule's segment", () => {
    mockUseFetchAndConvertObservationStats.mockReturnValue({
      primary: { isLoading: false, observationStats },
      secondary: [],
    });

    const { queryByTestId } = renderGraphStatistics();

    expect(queryByTestId(dataTestIds.actionStats(0).root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.actionStats(1).root)).not.toBeInTheDocument();

    act(() => queryByTestId(dataTestIds.dialogSchedulePicker).click());

    expect(queryByTestId(dataTestIds.actionStats(0).root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.actionStats(1).root)).toBeInTheDocument();
  });
});
