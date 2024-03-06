import { render } from '@testing-library/react';
import React from 'react';

import { WorkcenterPlanProgress } from '..';
import { useGetWorkcenters } from '../../../common/hooks';
import { Workcenter } from '../../../common/types';

import { dataTestIdsWorkcenterPlansProgress as dataTestIds, WorkcentersPlanProgress } from '.';

jest.mock('../../../common/hooks/use-get-workcenters');
const mockUseGetWorkcenters = useGetWorkcenters as jest.Mock;

const mockWorkspace = 'Seeder';

jest.mock('../workcenter-plan-progress');
const mockWorkcenterPlanProgress = WorkcenterPlanProgress as jest.Mock;
const mockWorkcenterPlanProgressDataTestId = 'mockWorkcenterPlanProgress';
mockWorkcenterPlanProgress.mockImplementation(({ workcenter }) => {
  return <div data-testid={mockWorkcenterPlanProgressDataTestId}>{workcenter.name}</div>;
});

describe('WorkcentersPlanProgress', () => {
  it('shows a list of workcenter plans associated with the given workspace', () => {
    const mockWorkcenters: Workcenter[] = [
      {
        name: 'Seed',
        path: 'sites/LAX1/farms/LAX1/workCenters/Seed',
        displayName: 'Seed',
      },
      {
        name: 'Pack',
        path: 'sites/LAX1/farms/LAX1/workCenters/Pack',
        displayName: 'Pack',
      },
    ];
    mockUseGetWorkcenters.mockReturnValue({
      isLoading: false,
      workcenters: mockWorkcenters,
    });

    const { queryAllByTestId } = render(<WorkcentersPlanProgress workspace={mockWorkspace} />);

    const renderedPlans = queryAllByTestId(mockWorkcenterPlanProgressDataTestId);
    expect(renderedPlans).toHaveLength(2);
    expect(renderedPlans[0]).toHaveTextContent(mockWorkcenters[0].name);
    expect(renderedPlans[1]).toHaveTextContent(mockWorkcenters[1].name);
  });

  it('shows message when there are no workcenters associated with the given workspace', () => {
    mockUseGetWorkcenters.mockReturnValue({
      isLoading: false,
      workcenters: [],
    });

    const { queryByTestId } = render(<WorkcentersPlanProgress workspace={mockWorkspace} />);

    expect(queryByTestId(dataTestIds.noAssociatedWorkcenters)).toBeInTheDocument();
  });
});
