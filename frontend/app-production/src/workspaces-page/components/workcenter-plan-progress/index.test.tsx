import { render } from '@testing-library/react';
import React from 'react';

import { useGetWorkcenterPlan } from '../../../common/hooks';
import { PlanProgressCard } from '../../../workcenters-page/components';
import { mockSeedInProgressPlan } from '../../../workcenters-page/test-helpers';

import { REFRESH_PERIOD, WorkcenterPlanProgress } from '.';

jest.mock('../../../common/hooks/use-get-workcenter-plan');
const mockuseGetWorkcenterPlan = useGetWorkcenterPlan as jest.Mock;
const mockRevalidate = jest.fn();
mockuseGetWorkcenterPlan.mockReturnValue({
  isLoading: false,
  revalidate: mockRevalidate,
  planResponse: mockSeedInProgressPlan,
});

jest.mock('../../../workcenters-page/components/plan-progress-card');
const mockPlanProgressCard = PlanProgressCard as jest.Mock;
mockPlanProgressCard.mockImplementation(() => <div>mock progress card</div>);

const mockWorkcenter = {
  name: 'Seed',
  path: 'sites/LAX1/farms/LAX1/workCenters/Seed',
  displayName: 'Seed',
};

describe('WorkcenterPlanProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockRevalidate.mockClear();
    mockPlanProgressCard.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reloads the plan every 15 secs', () => {
    render(<WorkcenterPlanProgress workcenter={mockWorkcenter} />);

    // called initially when component loads.
    expect(mockRevalidate).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(REFRESH_PERIOD - 1);
    expect(mockRevalidate).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(mockRevalidate).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(REFRESH_PERIOD - 1);
    expect(mockRevalidate).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1);
    expect(mockRevalidate).toHaveBeenCalledTimes(3);
  });

  it('shows the plan progress', () => {
    render(<WorkcenterPlanProgress workcenter={mockWorkcenter} />);

    expect(mockPlanProgressCard).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isLoading: false,
        plan: mockSeedInProgressPlan.plan,
        workcenterName: mockWorkcenter.displayName,
      }),
      expect.anything()
    );
  });
});
