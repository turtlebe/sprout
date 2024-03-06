import { ExpandMore } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { WorkcenterPlanProgress } from '..';
import { useGetWorkcenters } from '../../../common/hooks';

import { useStyles } from './styles';

const dataTestIds = {
  noAssociatedWorkcenters: 'workcenters-plan-progress-no-associated-workcenters',
};

export { dataTestIds as dataTestIdsWorkcenterPlansProgress };

export interface WorkcentersPlanProgress {
  workspace: string;
}

/**
 * For a given workspace, this component shows a list of all associated workcenters plan progress.
 */
export const WorkcentersPlanProgress: React.FC<WorkcentersPlanProgress> = ({ workspace }) => {
  // get all workcenters associated with given workspace
  const { workcenters, isLoading } = useGetWorkcenters(workspace);

  const classes = useStyles({ isLoading });

  const workcenterPlans = workcenters?.map(workcenter => (
    <Box key={workcenter.name} className={classes.workcenterProgessContainer}>
      <WorkcenterPlanProgress workcenter={workcenter} />
    </Box>
  ));

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <>
          <Typography variant="h6">Workcenter Plans Progress</Typography>
          <CircularProgress size="1rem" className={classes.progress} />
        </>
      </AccordionSummary>
      <Show when={!isLoading}>
        <AccordionDetails>
          <Show
            when={workcenterPlans?.length > 0}
            fallback={
              <Typography data-testid={dataTestIds.noAssociatedWorkcenters}>
                No workcenters associated with {workspace} workspace.
              </Typography>
            }
          >
            <Box className={classes.workcenterProgressListContainer}>{workcenterPlans}</Box>
          </Show>
        </AccordionDetails>
      </Show>
    </Accordion>
  );
};
