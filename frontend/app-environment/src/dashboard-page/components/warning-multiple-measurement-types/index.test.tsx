import { buildMetric, buildScheduleDefinition } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsWarningMultipleMeasurementTypes as dataTestIds, WarningMultipleMeasurementTypes } from '.';

const actionDefinitionTemperature = { from: 0, to: 100, measurementType: 'TEMPERATURE', graphable: true };
const actionDefinitionFlowrate = { from: 0, to: 100, measurementType: 'FLOW_RATE', graphable: true };

describe('WarningMultipleMeasurementTypes', () => {
  it('renders nothing', () => {
    const { container } = render(<WarningMultipleMeasurementTypes />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when multiple metrics have the same measurement type', () => {
    const { container } = render(
      <WarningMultipleMeasurementTypes
        metrics={[buildMetric({ measurementType: 'TEMPERATURE' }), buildMetric({ measurementType: 'TEMPERATURE' })]}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when multiple schedule definitions have the same measurement type', () => {
    const { container } = render(
      <WarningMultipleMeasurementTypes
        scheduleDefinitions={[
          buildScheduleDefinition({ actionDefinition: actionDefinitionTemperature }),
          buildScheduleDefinition({ actionDefinition: actionDefinitionTemperature }),
        ]}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a warning when metrics have multiple measurement types', () => {
    const { queryByTestId } = render(
      <WarningMultipleMeasurementTypes
        metrics={[buildMetric({ measurementType: 'TEMPERATURE' }), buildMetric({ measurementType: 'FLOW_RATE' })]}
      />
    );

    expect(queryByTestId(dataTestIds.warning)).toHaveTextContent('Metrics');
  });

  it('renders a warning when schedules have multiple measurement types', () => {
    const { queryByTestId } = render(
      <WarningMultipleMeasurementTypes
        scheduleDefinitions={[
          buildScheduleDefinition({ actionDefinition: actionDefinitionTemperature }),
          buildScheduleDefinition({ actionDefinition: actionDefinitionFlowrate }),
        ]}
      />
    );

    expect(queryByTestId(dataTestIds.warning)).toHaveTextContent('Schedules');
  });
});
