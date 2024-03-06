import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { mockIrrigationTasks } from '../../test-helpers/mock-irrigation-tasks';
import { dataTestIdsIrrigationTableRow } from '../irrigation-table-row';

import { IrrigationTable } from '.';

mockCurrentUser({ permissions: { HYP_PRODUCTION: 'FULL' } });

describe('IrrigationTable', () => {
  it('renders a table of irrigation tasks', () => {
    const lotName = mockIrrigationTasks[0].lotName;
    const tableSerial = mockIrrigationTasks[0].tableSerial;
    const rackPath = mockIrrigationTasks[0].rackPath;
    const tableLoadedDate = new Date(mockIrrigationTasks[0].plannedStartDate);

    const { queryAllByTestId } = render(
      <IrrigationTable
        irrigationTasks={mockIrrigationTasks}
        lotName={lotName}
        tableSerial={tableSerial}
        siteTimeZone="America/Los_Angeles"
        rackPath={rackPath}
        tableLoadedDate={tableLoadedDate}
        onRefreshIrrigationTasks={jest.fn()}
      />
    );

    // mock data should create 5 unscheduled tasks, so total rows generated should be mockIrrigationTasks.length + 5 = 11
    const unscheduleTasks = 5;

    expect(queryAllByTestId(dataTestIdsIrrigationTableRow.recipeDay)).toHaveLength(
      mockIrrigationTasks.length + unscheduleTasks
    );
  });
});
