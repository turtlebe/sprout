import { mockScheduleDefinitions, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { getIntervalStartWithoutDst } from '@plentyag/app-environment/src/common/utils';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTableScheduleReadOnly as dataTestIds, TableScheduleReadOnly } from '.';

mockUseFetchMeasurementTypes();

const [scheduleDefinition] = mockScheduleDefinitions;

describe('TableScheduleReadOnly', () => {
  it('renders nothing', () => {
    const { container } = render(<TableScheduleReadOnly schedule={null} scheduleDefinition={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a placeholder', () => {
    const [mockSchedule] = mockSchedules;
    const schedule = {
      ...mockSchedule,
      actions: null,
    };

    const { container } = render(<TableScheduleReadOnly schedule={schedule} scheduleDefinition={scheduleDefinition} />);

    expect(container).toHaveTextContent('The Schedule is not configured yet, start editing it now.');
  });

  it('renders a table containing the schedule info', () => {
    const [schedule] = mockSchedules;

    const { queryByTestId } = render(
      <TableScheduleReadOnly schedule={schedule} scheduleDefinition={scheduleDefinition} />
    );

    expect(schedule.actions).not.toHaveLength(0);

    schedule.actions.forEach(action => {
      expect(queryByTestId(dataTestIds.tableRow(action))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(action))).toHaveTextContent(
        getIntervalStartWithoutDst(schedule).add(action.time, 'seconds').format('hh:mm A')
      );
      expect(queryByTestId(dataTestIds.cellValue(action))).toHaveTextContent(action.value);
    });
  });

  it('renders a table containing the schedule info with multiple values', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'SetLightIntensity');
    const schedule = mockSchedules.find(s => s.path === scheduleDefinition.path);

    const { queryByTestId } = render(
      <TableScheduleReadOnly schedule={schedule} scheduleDefinition={scheduleDefinition} />
    );

    expect(schedule.actions).not.toHaveLength(0);

    schedule.actions.forEach(action => {
      expect(queryByTestId(dataTestIds.tableRow(action))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(action))).toHaveTextContent(
        getIntervalStartWithoutDst(schedule).add(action.time, 'seconds').format('hh:mm A')
      );
      expect(queryByTestId(dataTestIds.cellValue(action, 'zone1'))).toHaveTextContent(action.values.zone1);
      expect(queryByTestId(dataTestIds.cellValue(action, 'zone2'))).toHaveTextContent(action.values.zone2);
    });
  });
});
