import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { useRunActionPeriodicallyWhenVisible } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route } from 'react-router-dom';

import { useGetWorkcenter, useGetWorkcenterPlan } from '../common/hooks';
import { WorkcenterDetails, WorkcenterPlanResponse } from '../common/types';
import { WORKCENTER_REFRESH_PERIOD } from '../constants';

import { dataTestIdsWorkspacePage as dataTestIds, WorkcentersPage } from '.';

import { useChangeWorkcenterPlanExecutionStatus } from './hooks';
import {
  mockPropLoadCompletedPlan,
  mockPropLoadFailedPlan,
  mockPropLoadPausedPlan,
  mockSeedCreatedPlan,
  mockSeedCreatedPlanNoTasks,
  mockSeedInProgressPlan,
} from './test-helpers';

const mockWorkcenterWithOneTask: WorkcenterDetails = {
  name: 'Seed',
  path: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  displayName: 'Seed',
  actions: [
    {
      name: 'SeedTraysAndLoadTableToGerm',
      path: 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed/methods/SeedTraysAndLoadTableToGerm',
    },
  ],
};

jest.mock('../common/hooks/use-get-workcenter');
const mockUseGetWorkcenter = useGetWorkcenter as jest.Mock;

jest.mock('../common/hooks/use-get-workcenter-plan');
const mockUseGetWorkcenterPlan = useGetWorkcenterPlan as jest.Mock;

jest.mock('./hooks/use-change-workcenter-plan-execution-status');
const mockUseChangeWorkcenterPlanExecutionStatus = useChangeWorkcenterPlanExecutionStatus as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-run-action-periodically-when-visible');
const mockUseRunActionPeriodicallyWhenVisible = useRunActionPeriodicallyWhenVisible as jest.Mock;

describe('WorkcentersPage', () => {
  beforeEach(() => {
    mockUseGetWorkcenter.mockReset();
    mockUseGetWorkcenter.mockReturnValue({
      isLoading: false,
      workcenter: mockWorkcenterWithOneTask,
    });
  });

  function renderWorkcenterPage(plan?: WorkcenterPlanResponse, isChangingExecutionStatus?: boolean) {
    if (plan) {
      mockUseGetWorkcenterPlan.mockReturnValue({
        planResponse: plan,
        revalidate: () => {},
        isLoading: false,
      });
    }

    const mockChangeExecutionStatus = jest.fn();
    mockUseChangeWorkcenterPlanExecutionStatus.mockReturnValue({
      changeExecutionStatus: mockChangeExecutionStatus,
      isChangingExecutionStatus,
    });

    const path = '/production/workcenters/Seed';
    const history = createMemoryHistory({ initialEntries: [path] });

    const result = render(<Route path={'/production/workcenters/:name'} component={WorkcentersPage} />, {
      wrapper: ({ children }) => <AppProductionTestWrapper history={history}>{children}</AppProductionTestWrapper>,
    });

    return { ...result, mockChangeExecutionStatus };
  }

  it('disables change execution status button when there is no plan', () => {
    mockUseGetWorkcenterPlan.mockReturnValue({
      planResponse: undefined,
      isLoading: false,
      revalidate: () => {},
    });
    const { queryByTestId } = renderWorkcenterPage();

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeDisabled();
  });

  it('disables change execution status button when plan status is CREATED and there are no tasks', () => {
    const { queryByTestId } = renderWorkcenterPage(mockSeedCreatedPlanNoTasks);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeDisabled();
  });

  it('disables change execution status button when plan status is COMPLETED', () => {
    const { queryByTestId } = renderWorkcenterPage(mockPropLoadCompletedPlan);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeDisabled();
  });

  it('disables change execution status button when plan status is FAILED', () => {
    const { queryByTestId } = renderWorkcenterPage(mockPropLoadFailedPlan);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeDisabled();
  });

  it('disables change execution status button when status change is in progress', () => {
    const { queryByTestId } = renderWorkcenterPage(mockSeedCreatedPlan, true);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeDisabled();
  });

  it('enables change execution status button when there are tasks and shows button text "Execute All" when status is CREATED', () => {
    const { queryByTestId } = renderWorkcenterPage(mockSeedCreatedPlan);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeEnabled();
    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toHaveTextContent('Execute All');
  });

  it('enables change execution status button with text "Pause All" when status is RUNNING', () => {
    const { queryByTestId } = renderWorkcenterPage(mockSeedInProgressPlan);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeEnabled();
    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toHaveTextContent('Pause All');
  });

  it('enables change execution status button with text "Resume All" when status is PAUSED', () => {
    const { queryByTestId } = renderWorkcenterPage(mockPropLoadPausedPlan);

    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toBeEnabled();
    expect(queryByTestId(dataTestIds.changeExecutionStatusButton)).toHaveTextContent('Resume All');
  });

  it('executes the plan when button is clicked', () => {
    const { queryByTestId, mockChangeExecutionStatus } = renderWorkcenterPage(mockSeedCreatedPlan);

    queryByTestId(dataTestIds.changeExecutionStatusButton).click();

    expect(mockChangeExecutionStatus).toHaveBeenCalledTimes(1);
  });

  it('reloads workcenter plan periodically - even when the workcenter plan is empty', () => {
    // restore original implementation of hook for test.
    const actualImplementation = jest.requireActual(
      '@plentyag/core/src/hooks/use-run-action-periodically-when-visible'
    ).useRunActionPeriodicallyWhenVisible;
    mockUseRunActionPeriodicallyWhenVisible.mockImplementation(actualImplementation);

    jest.useFakeTimers();

    const mockRevalidateWorkcenterPlan = jest.fn();
    mockUseGetWorkcenterPlan
      .mockReturnValueOnce({
        planResponse: undefined,
        isLoading: false,
        revalidate: mockRevalidateWorkcenterPlan,
      })
      .mockReturnValue({
        planResponse: mockSeedCreatedPlanNoTasks,
        isLoading: false,
        revalidate: mockRevalidateWorkcenterPlan,
      });

    renderWorkcenterPage();

    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(WORKCENTER_REFRESH_PERIOD);

    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(WORKCENTER_REFRESH_PERIOD);

    expect(mockRevalidateWorkcenterPlan).toHaveBeenCalledTimes(3);

    jest.useRealTimers();
  });
});
