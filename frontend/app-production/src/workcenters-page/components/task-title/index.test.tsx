import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { WorkcenterTaskDetailsResponse } from '../../../common/types';
import {
  mockHarvestWorkcenterPlan,
  mockPackWorkcenterPlan,
  mockPropLoadWorkcenterPlan,
  mockPropUnloadWorkcenterPlan,
  mockSeedWorkcenterPlan,
  mockTransplantWorkcenterPlan,
} from '../../test-helpers';

import { TaskTitle } from '.';

import {
  dataTestIdsBlendPackageAndPalletizeSkuTaskTitle,
  dataTestIdsDefaultTaskTitle,
  dataTestIdsLoadEmptiesToVerticalGrowTaskTitle,
  dataTestIdsLoadTableIntoPropFromCleanTableStackTaskTitle,
  dataTestIdsLoadTableIntoPropFromGermTaskTitle,
  dataTestIdsPreparePropForProductionTaskTitle,
  dataTestIdsSeedTraysAndLoadTableToGermTaskTitle,
  dataTestIdsTransplantTowersAndLoadToVerticalGrowTaskTitle,
  dataTestIdsUnloadTableFromPropAndSendToTransplanterTaskTitle,
  dataTestIdsUnloadTowersFromVerticalGrowAndHarvestTaskTitle,
} from './components';

describe('TaskTitle', () => {
  function renderTaskTitleAndExpectTestIdToBeInTheDocument(
    mockTask: WorkcenterTaskDetailsResponse,
    dataTestId: string
  ) {
    const { queryByTestId } = render(<TaskTitle task={mockTask} />, {
      wrapper: AppProductionTestWrapper,
    });
    expect(queryByTestId(dataTestId)).toBeInTheDocument();
  }

  it('renders the default task with unknown workcenter name', () => {
    const mockTaskWithUnknownWorkcenter = cloneDeep(mockHarvestWorkcenterPlan.detailsOfTasksFromPlan[0]);
    mockTaskWithUnknownWorkcenter.taskDetails.workcenter = 'sites/LAX1/farms/LAX1/workCenters/unknown';
    renderTaskTitleAndExpectTestIdToBeInTheDocument(mockTaskWithUnknownWorkcenter, dataTestIdsDefaultTaskTitle.title);
  });

  it('renders the default task with unknown task name', () => {
    const mockTaskWithUnknownTask = cloneDeep(mockHarvestWorkcenterPlan.detailsOfTasksFromPlan[0]);
    mockTaskWithUnknownTask.taskDetails.taskPath =
      'sites/LAX1/farms/LAX1/workCenters/Harvest/interfaces/Harvest/methods/unknown';
    renderTaskTitleAndExpectTestIdToBeInTheDocument(mockTaskWithUnknownTask, dataTestIdsDefaultTaskTitle.title);
  });

  it('renders the "Harvest UnloadTowersFromVerticalGrowAndHarvest" task title', () => {
    const mockUnloadTowersFromVerticalGrowAndHarvestTask = mockHarvestWorkcenterPlan.detailsOfTasksFromPlan[0];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockUnloadTowersFromVerticalGrowAndHarvestTask,
      dataTestIdsUnloadTowersFromVerticalGrowAndHarvestTaskTitle.root
    );
  });

  it('renders the "Pack BlendPackageAndPalletizeSku" task title', () => {
    const mockBlendPackageAndPalletizeSku = mockPackWorkcenterPlan.detailsOfTasksFromPlan[0];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockBlendPackageAndPalletizeSku,
      dataTestIdsBlendPackageAndPalletizeSkuTaskTitle.root
    );
  });

  it('renders the "PropLoad LoadTableIntoPropFromCleanTableStack" task title', () => {
    const mockLoadTableIntoPropFromCleanTableStackTask = mockPropLoadWorkcenterPlan.detailsOfTasksFromPlan[2];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockLoadTableIntoPropFromCleanTableStackTask,
      dataTestIdsLoadTableIntoPropFromCleanTableStackTaskTitle.root
    );
  });

  it('renders the "PropLoad LoadTableIntoPropFromGerm" task title', () => {
    const mockLoadTableIntoPropFromGermTask = mockPropLoadWorkcenterPlan.detailsOfTasksFromPlan[0];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockLoadTableIntoPropFromGermTask,
      dataTestIdsLoadTableIntoPropFromGermTaskTitle.root
    );
  });

  it('renders the "PropUnload PreparePropForProduction" task title', () => {
    const mockPreparePropForProductionTask = mockPropUnloadWorkcenterPlan.detailsOfTasksFromPlan[0];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockPreparePropForProductionTask,
      dataTestIdsPreparePropForProductionTaskTitle.root
    );
  });

  it('renders the "PropUnload UnloadTableFromPropAndSendToTransplanter" task title', () => {
    const mockUnloadTableFromPropAndSendToTransplanterTask = mockPropUnloadWorkcenterPlan.detailsOfTasksFromPlan[1];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockUnloadTableFromPropAndSendToTransplanterTask,
      dataTestIdsUnloadTableFromPropAndSendToTransplanterTaskTitle.root
    );
  });

  it('renders the "Seed SeedTraysAndLoadTableToGerm" task title', () => {
    const mockSeedTraysAndLoadTableToGermTask = mockSeedWorkcenterPlan.detailsOfTasksFromPlan[0];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockSeedTraysAndLoadTableToGermTask,
      dataTestIdsSeedTraysAndLoadTableToGermTaskTitle.root
    );
  });

  it('renders the "Transplant LoadEmptiesToVerticalGrow" task title', () => {
    const mockLoadEmptiesToVerticalGrowTask = mockTransplantWorkcenterPlan.detailsOfTasksFromPlan[1];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockLoadEmptiesToVerticalGrowTask,
      dataTestIdsLoadEmptiesToVerticalGrowTaskTitle.root
    );
  });

  it('renders the "Transplant TransplantTowersAndLoadToVerticalGrow" task title', () => {
    const mockTransplantTowersAndLoadToVerticalGrowTask = mockTransplantWorkcenterPlan.detailsOfTasksFromPlan[0];
    renderTaskTitleAndExpectTestIdToBeInTheDocument(
      mockTransplantTowersAndLoadToVerticalGrowTask,
      dataTestIdsTransplantTowersAndLoadToVerticalGrowTaskTitle.root
    );
  });
});
