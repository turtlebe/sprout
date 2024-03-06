import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsSummary } from '../../../common/components';
import { mockSeedInProgressPlan } from '../../test-helpers';

import {
  dataTestIdsPlanProgress as dataTestIds,
  FOR_TODAY,
  NO_PLAN_STATUS,
  NO_PLAN_STATUS_DETAIL,
  PLAN_STATUS_DETAIL,
  PlanProgressCard,
} from '.';

describe('PlanProgressCard', () => {
  function renderPlanProgressCard(props: React.ComponentProps<typeof PlanProgressCard>) {
    return render(<PlanProgressCard {...props} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows "for today" in the title when current date matches given planDate', () => {
    const today = new Date();
    const { queryByTestId } = renderPlanProgressCard({ planDate: today, plan: undefined });

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(FOR_TODAY);
  });

  it('shows just title w/o "for today" when date is in the future', () => {
    const nextYear = new Date();
    nextYear.setFullYear(new Date().getFullYear() + 1);
    const { queryByTestId } = renderPlanProgressCard({ planDate: nextYear, plan: undefined });

    expect(queryByTestId(dataTestIds.title)).not.toHaveTextContent(FOR_TODAY);
  });

  it('shows title with link when "workcenterName" and "workcentersBasePath" props are provided', () => {
    const mockWorkcenterName = 'wc-name';
    const mockWorkcenterBasePath = `${mockBasePath}/workcenters`;
    const today = new Date();
    const { queryByTestId } = renderPlanProgressCard({
      planDate: today,
      plan: undefined,
      workcenterName: mockWorkcenterName,
    });

    expect(queryByTestId(dataTestIds.titleLink)).toHaveTextContent(mockWorkcenterName);
    expect(queryByTestId(dataTestIds.titleLink)).toHaveAttribute(
      'href',
      `${mockWorkcenterBasePath}/${mockWorkcenterName}`
    );
  });

  it('shows plan progress', () => {
    const plan = mockSeedInProgressPlan.plan;
    const { queryByTestId } = renderPlanProgressCard({ planDate: new Date(), plan });

    expect(queryByTestId(dataTestIds.progress)).toHaveTextContent(`${plan.progress}%`);
  });

  it('shows status message and detail when no plan is provided', () => {
    const { queryByTestId } = renderPlanProgressCard({ planDate: new Date(), plan: undefined });

    expect(queryByTestId(dataTestIds.status)).toHaveTextContent(NO_PLAN_STATUS);
    expect(queryByTestId(dataTestIds.statusDetail)).toHaveTextContent(NO_PLAN_STATUS_DETAIL);
  });

  it('shows plan status and detail when plan is provided', () => {
    const plan = mockSeedInProgressPlan.plan;
    const { queryByTestId } = renderPlanProgressCard({ planDate: new Date(), plan });

    expect(queryByTestId(dataTestIds.status)).toHaveTextContent(plan.status);
    expect(queryByTestId(dataTestIds.statusDetail)).toHaveTextContent(PLAN_STATUS_DETAIL[plan.status]);
  });

  it('shows plan summary', () => {
    const plan = mockSeedInProgressPlan.plan;
    const { queryByTestId } = renderPlanProgressCard({ planDate: new Date(), plan });

    expect(queryByTestId(dataTestIdsSummary.listRoot)).toBeInTheDocument();
  });
});
