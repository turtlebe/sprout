import {
  AppHeader,
  AppLayout,
  BaseAgGridClientSideTable,
  CircularProgressCentered,
  Show,
} from '@plentyag/brand-ui/src/components';
import {
  RefreshButton,
  dataTestids as refreshButtonDataTestIds,
} from '@plentyag/brand-ui/src/components/refresh-button';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { orderBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { TaskStatus } from '../common/types';

import { useGetDurativeTasksByStatus } from './hooks/use-get-durative-tasks-by-status';
import { useTasksAgGridConfig } from './hooks/use-tasks-ag-grid-config';
import { useStyles } from './styles';

const dataTestIds = {
  root: 'reactors-and-tasks-table-root',
  displayName: 'reactors-and-tasks-table-display-name',
  loading: 'reactors-and-tasks-table-loading',
  taskTitle: (id: string) => `reactors-and-tasks-table-${id}`,
  taskLink: (id: string) => `reactors-and-tasks-table-link-${id}`,
  reactorLink: (id: string) => `reactors-and-tasks-table-reactor-${id}`,
  refreshButton: refreshButtonDataTestIds.button,
};

export { dataTestIds as dataTestIdsReactorsAndTasksTablePage };

export const ReactorsAndTasksTablePage: React.FC = () => {
  const { tasks, refetch, isLoading } = useGetDurativeTasksByStatus(TaskStatus.RUNNING);
  const preSortedTasks = useMemo(() => orderBy(tasks, 'createdAt', 'desc'), [tasks]); // Pre sort by date by default
  const agGridConfig = useTasksAgGridConfig(preSortedTasks);
  const classes = useStyles({ isLoading });
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>();

  useEffect(() => {
    if (tasks?.length > 0) {
      setLastRefreshedAt(new Date().toISOString());
    }
  }, [tasks]);

  const handleRefreshData = async () => {
    await refetch();
  };

  return (
    <AppLayout data-testid={dataTestIds.root}>
      <AppHeader justifyContent="space-between">
        <Box pl={1}>
          <Typography variant="h5" data-testid={dataTestIds.displayName}>
            Reactors and Tasks Table
          </Typography>
        </Box>
        <RefreshButton lastRefreshedAt={lastRefreshedAt} onClick={handleRefreshData} />
      </AppHeader>
      <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loading} />}>
        <Typography paragraph className={classes.subTitle} data-testid={dataTestIds.displayName}>
          Click on the title to see task details. You may also click on the reactor path to see reactor state details.
        </Typography>
        <BaseAgGridClientSideTable agGridConfig={agGridConfig} persistFilterAndSortModelsInLocalStorage={false} />
      </Show>
    </AppLayout>
  );
};
