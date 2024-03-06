import { Pause, PlayArrow } from '@material-ui/icons';
import { Timeline } from '@material-ui/lab';
import { AppHeader, AppLayout, Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, Card, CardContent, CardHeader, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useRunActionPeriodicallyWhenVisible } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useGetWorkcenter, useGetWorkcenterPlan } from '../common/hooks';
import { PlanStatus } from '../common/types';
import { WORKCENTER_REFRESH_PERIOD } from '../constants';

import { CompletedTasks, PendingTasks, PlanDatePicker, PlanProgressCard, RunningTasks } from './components';
import { useChangeWorkcenterPlanExecutionStatus } from './hooks';
import { usePlanDate } from './hooks/use-plan-date';

const dataTestIds = {
  changeExecutionStatusButton: 'workcenters-page-change-execution-status',
};

export { dataTestIds as dataTestIdsWorkspacePage };

interface WorkcentersPageUrlParams {
  name: string;
}

export const WorkcentersPage: React.FC<RouteComponentProps<WorkcentersPageUrlParams>> = props => {
  const { name } = props.match.params;

  const { isLoading: isLoadingWorkcenter, workcenter, hasError } = useGetWorkcenter(name);

  const { planDate, setPlanDate } = usePlanDate();

  const {
    isLoading: isLoadingWorkcenterPlan,
    planResponse,
    revalidate: revalidateWorkcenterPlan,
  } = useGetWorkcenterPlan({ planDate, workcenterPath: workcenter?.path });
  const plan = planResponse?.plan;
  const status = plan?.status;
  const tasks = planResponse?.detailsOfTasksFromPlan;

  useRunActionPeriodicallyWhenVisible({
    condition: () => !isLoadingWorkcenterPlan,
    action: () => void revalidateWorkcenterPlan(),
    period: WORKCENTER_REFRESH_PERIOD,
  });

  const { changeExecutionStatus, isChangingExecutionStatus } = useChangeWorkcenterPlanExecutionStatus({
    plannedDate: planDate,
    workcenterPath: workcenter?.path,
    revalidateWorkcenterPlan,
  });

  const planIsExecutable =
    (plan?.taskOrdering?.length && status === PlanStatus.CREATED) ||
    status === PlanStatus.PAUSED ||
    status === PlanStatus.RUNNING;

  const isLoading = isLoadingWorkcenter || isLoadingWorkcenterPlan || isChangingExecutionStatus;

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader flexDirection="row" alignItems="center">
        <Box>
          <Typography variant="h5" style={{ marginLeft: 5 }}>
            {name} Workcenter
          </Typography>
        </Box>
        <Box display="flex" mx={1} flexWrap="wrap" alignItems="center">
          <Box m={0.5}>
            <PlanDatePicker planDate={planDate} onDateChange={setPlanDate} />
          </Box>
          <Box m={0.5}>
            <Button
              data-testid={dataTestIds.changeExecutionStatusButton}
              onClick={() => changeExecutionStatus(status)}
              variant="contained"
              startIcon={status === PlanStatus.RUNNING ? <Pause /> : <PlayArrow />}
              disabled={isChangingExecutionStatus || !planIsExecutable}
            >
              {status === PlanStatus.PAUSED
                ? 'Resume All'
                : status === PlanStatus.RUNNING
                ? 'Pause All'
                : 'Execute All'}
            </Button>
          </Box>
        </Box>
      </AppHeader>
      <Show when={!hasError}>
        <Box m={1} style={{ overflowY: 'auto' }}>
          <Box p={1}>
            <PlanProgressCard plan={plan} planDate={planDate} />
          </Box>
          <Box p={1}>
            <Card>
              <CardHeader title="All Tasks" />
              <CardContent>
                <Timeline>
                  <CompletedTasks tasks={tasks} />
                  <RunningTasks tasks={tasks} />
                  <PendingTasks
                    plannedDate={planDate}
                    workcenter={workcenter}
                    planResponse={planResponse}
                    revalidateWorkcenterPlan={revalidateWorkcenterPlan}
                  />
                </Timeline>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Show>
    </AppLayout>
  );
};
