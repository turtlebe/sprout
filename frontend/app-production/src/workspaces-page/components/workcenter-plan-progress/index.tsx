import { useRunActionPeriodicallyWhenVisible } from '@plentyag/core/src/hooks';
import React from 'react';

import { useGetWorkcenterPlan } from '../../../common/hooks';
import { Workcenter } from '../../../common/types';
import { PlanProgressCard } from '../../../workcenters-page/components';

const dataTestIds = {};

export { dataTestIds as dataTestIdsWorkcenterProgess };

export const REFRESH_PERIOD = 15000;

export interface WorkcenterPlanProgress {
  workcenter: Workcenter;
}

/**
 * This component shows the current plan progress for the given workcenter.
 */
export const WorkcenterPlanProgress: React.FC<WorkcenterPlanProgress> = ({ workcenter }) => {
  const today = new Date();
  const { isLoading, revalidate, planResponse } = useGetWorkcenterPlan({
    planDate: today,
    workcenterPath: workcenter?.path,
  });

  useRunActionPeriodicallyWhenVisible({
    condition: () => !isLoading,
    action: revalidate,
    period: REFRESH_PERIOD,
  });

  return (
    <PlanProgressCard
      raised
      titleVariant="h6"
      isLoading={isLoading}
      planDate={today}
      plan={planResponse?.plan}
      workcenterName={workcenter.displayName}
    />
  );
};
