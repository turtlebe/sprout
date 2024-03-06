import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockSeedWorkcenterPlan } from '@plentyag/app-production/src/workcenters-page/test-helpers';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import {
  dataTestIdsSeedTraysAndLoadTableToGermTaskTitle as dataTestIds,
  SeedTraysAndLoadTableToGermTaskTitle,
} from '.';

const mockSeedTraysAndLoadTableToGermTask = mockSeedWorkcenterPlan.detailsOfTasksFromPlan[0];

describe('SeedTraysAndLoadTableToGermTaskTitle', () => {
  function renderSeedTraysAndLoadTableToGermTaskTitle(mockTask = mockSeedTraysAndLoadTableToGermTask) {
    return render(<SeedTraysAndLoadTableToGermTaskTitle task={mockTask} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows completed task seed title', () => {
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle();
    // should have past tense since task is completed
    expect(queryByTestId(dataTestIds.seedTitle)).toHaveTextContent('Seeded');
  });

  it('shows running task seed title', () => {
    const mockSeedTraysAndLoadTableToGermRunningTask = mockSeedWorkcenterPlan.detailsOfTasksFromPlan[1];
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle(mockSeedTraysAndLoadTableToGermRunningTask);
    // should have past tense since task is running
    expect(queryByTestId(dataTestIds.seedTitle)).toHaveTextContent('Seeding');
  });

  it('shows pending task seed title', () => {
    const mockSeedTraysAndLoadTableToGermRunningTask = mockSeedWorkcenterPlan.detailsOfTasksFromPlan[3];
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle(mockSeedTraysAndLoadTableToGermRunningTask);
    // should have futre tense since task is pending
    expect(queryByTestId(dataTestIds.seedTitle)).toHaveTextContent(/^Seed$/);
  });

  it('shows table link when table serial is provided', () => {
    const mockTaskWithLoadedTableSerial = cloneDeep(mockSeedTraysAndLoadTableToGermTask);
    mockTaskWithLoadedTableSerial.executionDetails['loadedTableSerial'] = 'tableSerial';
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle(mockTaskWithLoadedTableSerial);

    expect(queryByTestId(dataTestIds.tableFallback)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableLink)).toHaveTextContent('Table');
  });

  it('shows fallback when no table serial is provided', () => {
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle();

    expect(queryByTestId(dataTestIds.tableFallback)).toHaveTextContent('table');
    expect(queryByTestId(dataTestIds.tableLink)).not.toBeInTheDocument();
  });

  it('shows prescription for each tray', () => {
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle();

    const prescriptions = queryByTestId(dataTestIds.prescriptionTitles);
    expect(prescriptions.children).toHaveLength(2);
    expect(prescriptions.children[0]).toHaveTextContent('5 Trays of WHC');
    expect(prescriptions.children[1]).toHaveTextContent('10 Trays of C11');
  });

  it('shows germination stack', () => {
    const { queryByTestId } = renderSeedTraysAndLoadTableToGermTaskTitle();

    expect(queryByTestId(dataTestIds.germStack)).toHaveTextContent('GermStack7');
  });
});
