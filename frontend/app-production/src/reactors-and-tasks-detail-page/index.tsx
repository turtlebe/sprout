import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { Show, TabPanel } from '@plentyag/brand-ui/src/components';
import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import {
  Box,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useQueryParam } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { ReactorState, ReactorStateBehaviorTree, TaskProgress, TaskState, TaskStateBehaviorTree } from './components';
import { TabStates, useGetReactorPaths, useTabQueryParameter } from './hooks';
import { useStyles } from './styles';
import { ReactorPath } from './types';

const dataTestIds = {
  autocomplete: 'reactors-and-tasks-page-autocomplete',
  taskProgressTab: 'reactors-and-tasks-page-task-proress-tab',
  taskStateTab: 'reactors-and-tasks-page-task-state-tab',
  reactorStateTab: 'reactors-and-tasks-page-reactor-state-tab',
};

export { dataTestIds as dataTestIdsReactorsAndTasks };

export const TASK_ID_QUERY_PARAMETER = 'taskId';

interface ReactorsAndTasksPageUrlParams {
  reactorPath: string;
}

const REACTOR_BEHAVIOR_TREE_FEATURE_KEY = 'reactor-behavior-tree';

export const ReactorsAndTasksDetailPage: React.FC<RouteComponentProps<ReactorsAndTasksPageUrlParams>> = ({ match }) => {
  const { reactorPath = null } = match.params;
  const history = useHistory();
  const queryParameters = useQueryParam();
  const taskId = queryParameters.get(TASK_ID_QUERY_PARAMETER);
  const { tab, setTab } = useTabQueryParameter(taskId);
  const classes = useStyles();

  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  const allowReactorBehaviorTreeValue = useFeatureFlag(REACTOR_BEHAVIOR_TREE_FEATURE_KEY);
  const allowReactorBehaviorTree = Boolean(allowReactorBehaviorTreeValue);

  const { reactorPaths, isLoading } = useGetReactorPaths();
  const [selectedReactorPath, setSelectedReactorPath] = React.useState<ReactorPath>(reactorPath);

  function updateSelection(newReactorPath: ReactorPath) {
    if (selectedReactorPath !== newReactorPath) {
      setSelectedReactorPath(newReactorPath);
    }
    // set reactor path
    const path = newReactorPath
      ? `${reactorsAndTasksDetailBasePath}/${newReactorPath}`
      : reactorsAndTasksDetailBasePath;
    if (history.location.pathname !== path) {
      // remove taskId when reactor path changes
      queryParameters.delete(TASK_ID_QUERY_PARAMETER);
      history.push({ pathname: path, search: queryParameters.toString() });
    }
  }

  function hasInvalidTab(tab: TabStates, taskId: string) {
    // tabs: "taskProgress" and "taskState" both require a taskId to be valid/shown.
    return !taskId && (tab === TabStates.taskProgress || tab === TabStates.taskState);
  }

  React.useEffect(() => {
    if (hasInvalidTab(tab, taskId)) {
      setTab(TabStates.reactorState);
    }
  }, [taskId]);

  React.useEffect(() => {
    if (selectedReactorPath && reactorPaths && !isLoading && !reactorPaths.includes(selectedReactorPath)) {
      updateSelection(null);
    }
  }, [reactorPaths, isLoading, selectedReactorPath]);

  React.useEffect(() => {
    updateSelection(reactorPath);
  }, [reactorPath]);

  return (
    <Box className={classes.container}>
      <Typography variant="h5" gutterBottom>
        Reactors and Tasks Detail
      </Typography>
      <Autocomplete<ReactorPath, false, true, false>
        data-testid={dataTestIds.autocomplete}
        value={selectedReactorPath}
        onChange={(event, value) => updateSelection(value)}
        options={reactorPaths || []}
        renderInput={params => (
          <TextField
            {...params}
            label="Search for a reactor"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress size="1rem" /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <Box display="flex" ml={4} mr={4}>
        <Tabs
          classes={{ flexContainer: classes.tabsFlexContainer }}
          className={classes.tabsContainer}
          value={hasInvalidTab(tab, taskId) ? TabStates.reactorState : tab}
          onChange={(event, value) => setTab(value)}
        >
          {taskId && (
            <Tab data-testid={dataTestIds.taskProgressTab} value={TabStates.taskProgress} label="Task Progress" />
          )}
          {taskId && (
            <Tab data-testid={dataTestIds.taskStateTab} value={TabStates.taskState} label="Task State Details" />
          )}
          {taskId && allowReactorBehaviorTree && (
            <Tab value={TabStates.taskStateBehaviorTree} label="Task State Behavior Tree" />
          )}
          <Tab data-testid={dataTestIds.reactorStateTab} value={TabStates.reactorState} label="Reactor State" />
          {allowReactorBehaviorTree && (
            <Tab value={TabStates.reactorStateBehaviorTree} label="Reactor State Behavior Tree" />
          )}
        </Tabs>
      </Box>
      <Divider />
      <TabPanel className={classes.tabPanel} value={tab} index={TabStates.taskProgress}>
        <TaskProgress taskId={taskId} isTaskListDefaultExpanded reactorPath={selectedReactorPath} />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tab} index={TabStates.taskState}>
        <TaskState taskId={taskId} reactorPath={selectedReactorPath} />
      </TabPanel>
      <Show when={allowReactorBehaviorTree}>
        <TabPanel className={classes.tabPanel} value={tab} index={TabStates.taskStateBehaviorTree}>
          <TaskStateBehaviorTree taskId={taskId} />
        </TabPanel>
      </Show>
      <TabPanel className={classes.tabPanel} value={tab} index={TabStates.reactorState}>
        <ReactorState reactorPath={selectedReactorPath} />
      </TabPanel>
      <Show when={allowReactorBehaviorTree}>
        <TabPanel className={classes.tabPanel} value={tab} index={TabStates.reactorStateBehaviorTree}>
          <ReactorStateBehaviorTree reactorPath={selectedReactorPath} />
        </TabPanel>
      </Show>
    </Box>
  );
};
