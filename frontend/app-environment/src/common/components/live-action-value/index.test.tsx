import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { buildSchedule, buildScheduleDefinition } from '../../test-helpers';

import { dataTestIdsLiveActionValue as dataTestIds, LiveActionValue } from '.';

describe('LiveActionValue', () => {
  beforeEach(() => {
    mockUseFetchMeasurementTypes();
  });
  it('renders nothing when the schedule is null', () => {
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinition: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
    });

    const { container } = render(<LiveActionValue schedule={null} scheduleDefinition={scheduleDefinition} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the schedule definition is null', () => {
    const schedule = buildSchedule({});

    const { container } = render(<LiveActionValue schedule={schedule} scheduleDefinition={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders an no data icon when the schedule has no actions', () => {
    const schedule = buildSchedule({ actions: [] });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinition: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
    });

    const { queryByTestId } = render(<LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefinition} />);

    expect(queryByTestId(dataTestIds.noActions)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.invalidActionDefinitionKey)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders the current action value for a single value schedule', () => {
    const schedule = buildSchedule({ actions: [{ time: 0, valueType: 'SINGLE_VALUE', value: '15' }] });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinition: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
    });

    const { queryByTestId } = render(<LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefinition} />);

    expect(queryByTestId(dataTestIds.noActions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.invalidActionDefinitionKey)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('15 C');
  });

  it('renders a specific action value when using actionDefinitonKey for mutliple value schedule', () => {
    const schedule = buildSchedule({
      actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
    });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });

    const { queryByTestId } = render(
      <LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefinition} actionDefinitionKey="zone2" />
    );

    expect(queryByTestId(dataTestIds.noActions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.invalidActionDefinitionKey)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('18 C');
  });

  it('renders a broken icon when the actionDefinitionKey choosen is not valid', () => {
    const schedule = buildSchedule({
      actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
    });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });

    const { queryByTestId } = render(
      <LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefinition} actionDefinitionKey="zone3" />
    );

    expect(queryByTestId(dataTestIds.noActions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.invalidActionDefinitionKey)).toBeInTheDocument();
  });

  it('renders the first value when they are all the same and actionDefinitionKey is not used', () => {
    const schedule = buildSchedule({
      actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '15' } }],
    });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });

    const { queryByTestId } = render(<LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefinition} />);

    expect(queryByTestId(dataTestIds.noActions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.invalidActionDefinitionKey)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.conflict)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('15 C');
  });

  it('renders a broken icon when multiple values are not the same and actionDefinitionKey is not used', () => {
    const schedule = buildSchedule({
      actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
    });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });

    const { queryByTestId } = render(<LiveActionValue schedule={schedule} scheduleDefinition={scheduleDefinition} />);

    expect(queryByTestId(dataTestIds.noActions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.invalidActionDefinitionKey)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.conflict)).toBeInTheDocument();
  });
});
