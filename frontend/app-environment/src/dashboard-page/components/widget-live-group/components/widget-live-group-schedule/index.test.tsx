import { useConverter } from '@plentyag/app-environment/src/common/hooks';
import { buildSchedule, buildScheduleDefinition } from '@plentyag/app-environment/src/common/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsWidgetLiveGroupSchedule as dataTestIds, WidgetLiveGroupSchedule } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-converter');
jest.mock('@plentyag/core/src/hooks/use-fetch-measurement-types');

const mockUseConverter = useConverter as jest.Mock;
const schedule = buildSchedule({ actions: [{ time: 0, valueType: 'SINGLE_VALUE', value: '0' }] });
const scheduleDefinition = buildScheduleDefinition({
  actionDefinition: { measurementType: 'TEMPERATURE', from: 0, to: 0, graphable: true },
});
const remainingPath = 'GermLine/SetLightIntensity';

function renderWidgetLiveGroupSchedule() {
  return render(
    <MemoryRouter>
      <WidgetLiveGroupSchedule schedule={schedule} remainingPath={remainingPath} options={{}} />
    </MemoryRouter>
  );
}

describe('WidgetLiveGroupSchedule', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseConverter.mockReturnValue({ schedule, scheduleDefinition, isLoading: false });

    mockUseFetchMeasurementTypes();
  });

  it('renders with a loader', () => {
    mockUseConverter.mockReturnValue({ schedule: undefined, scheduleDefinition: undefined, isLoading: true });

    const { queryByTestId } = renderWidgetLiveGroupSchedule();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(remainingPath);
  });

  it('renders the current setpoint', () => {
    const { queryByTestId } = renderWidgetLiveGroupSchedule();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.path)).toHaveTextContent(remainingPath);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('0 C');
  });
});
