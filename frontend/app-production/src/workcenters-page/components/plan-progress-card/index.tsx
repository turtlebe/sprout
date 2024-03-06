import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { Card, Show } from '@plentyag/brand-ui/src/components';
import { CardProps, Link, Typography, TypographyProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { SummaryView } from '../../../common/components';
import { PlanStatus, WorkcenterPlan } from '../../../common/types';

const dataTestIds = {
  title: 'plan-progess-card-title',
  titleLink: 'plan-progress-card-title-link',
  progress: 'plan-progess-card-progress',
  status: 'plan-progess-card-status',
  statusDetail: 'plan-progess-card-status-detail',
};

export { dataTestIds as dataTestIdsPlanProgress };

export const FOR_TODAY = ' for today';

export const NO_PLAN_STATUS = 'No Plan';
export const NO_PLAN_STATUS_DETAIL = 'No tasks have been created and there is no plan in place for the day';

export const PLAN_STATUS_DETAIL: Record<PlanStatus, string> = {
  [PlanStatus.CREATED]: 'Workcenter plan has been created and is ready to begin running',
  [PlanStatus.RUNNING]: 'Tasks are running and workcenter will continue to run tasks until no pending tasks remain',
  [PlanStatus.PAUSED]:
    'Currently executing tasks will continue to run, and any Pending tasks will not start while plan is Paused. Press “Resume all” to start pending task.',
  [PlanStatus.COMPLETED]: 'All tasks have completed and the workcenter plan is complete',
  [PlanStatus.FAILED]: 'One or multiple workcenter tasks failed to complete and the workcenter plan has failed',
};

export interface PlanProgress {
  planDate: Date;
  plan: WorkcenterPlan;
  workcenterName?: string;
  isLoading?: boolean;
  raised?: CardProps['raised'];
  titleVariant?: TypographyProps['variant'];
}

/**
 * This component displays the high-level progress and state for the workcenter plan
 */
export const PlanProgressCard: React.FC<PlanProgress> = ({
  planDate,
  plan,
  workcenterName,
  isLoading,
  raised,
  titleVariant = 'h5',
}) => {
  const { workcentersBasePath } = useAppPaths();

  // optionally add workcenter link to title.
  const workcenterPath = workcentersBasePath && workcenterName && (
    <>
      <Link data-testid={dataTestIds.titleLink} component={NavLink} to={`${workcentersBasePath}/${workcenterName}`}>
        {workcenterName}
      </Link>
      &nbsp;
    </>
  );

  const today = new Date();
  const progressTitle = 'Progress' + (planDate.toDateString() === today.toDateString() ? FOR_TODAY : '');

  const title = (
    <>
      {workcenterPath}
      {progressTitle}
    </>
  );
  return (
    <Card
      raised={raised}
      title={title}
      data-testid={dataTestIds.title}
      isLoading={isLoading}
      titleVariant={titleVariant}
    >
      <Show when={Boolean(plan)}>
        <Typography data-testid={dataTestIds.progress}>Progress: {plan?.progress || 0}%</Typography>
      </Show>
      <Typography data-testid={dataTestIds.status}>Status: {plan?.status || NO_PLAN_STATUS}</Typography>
      <Typography data-testid={dataTestIds.statusDetail}>
        Status Detail: {plan?.status ? PLAN_STATUS_DETAIL[plan.status] : NO_PLAN_STATUS_DETAIL}
      </Typography>
      <Show when={Boolean(plan)}>
        <SummaryView summary={plan?.summary} />
      </Show>
    </Card>
  );
};
