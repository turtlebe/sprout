import IconButton from '@material-ui/core/IconButton';
import { Clear as ClearIcon, ExpandMore, Search as SearchIcon } from '@material-ui/icons';
import { WORKSPACE_TASKS_SEARCH_QUERY_PARAM } from '@plentyag/app-production/src/constants';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useQueryParam } from '@plentyag/core/src/hooks';
import React from 'react';

import { CommonTasksAndActions, CurrentTasks } from '..';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'workbin-tasks-root',
  searchField: 'workbin-tasks-search-search-field',
  searchResultMessage: 'workbin-taskse-search-result-message',
  accordionSummary: 'workbin-tasks-accordion-summary',
};

export { dataTestIds as dataTestIdsWorkbinTasks };

export interface WorkbinTasks {
  workspace: string;
  onTaskCompleted?: () => void;
}

/**
 * This components shows all of the workbin tasks for the given workspace. There
 * are two types of tasks shown. These task are generally manual tasks that the
 * operation user needs to perform. Ex: load 30 bags of seeds into seeder machine.
 * 1. Today's workbin tasks - these are tasks created by executive service that
 * the operations user needs to address during their shift.
 * 2. Common tasks - these are routine tasks that the operations user might need to do
 * and are kept here to make it convenient for the person to find and execute.
 */
export const WorkbinTasks: React.FC<WorkbinTasks> = ({ workspace, onTaskCompleted }) => {
  const ref = React.useRef<HTMLElement>(null);

  const classes = useStyles();

  const [{ currentUser }] = useCoreStore();
  const { currentFarmDefPath } = currentUser;

  const queryParams = useQueryParam();
  const tasksQuery = queryParams.get(WORKSPACE_TASKS_SEARCH_QUERY_PARAM);

  const [isExpanded, setExpanded] = React.useState<boolean>(true);
  const [searchText, setSearchText] = React.useState<string>(tasksQuery ?? '');
  const [currentTaskSearchCount, setCurrentTasksSearchCount] = React.useState(0);
  const [commonTaskSearchCount, setCommonTasksSearchCount] = React.useState(0);

  /**
   * If there is a "tasksQuery" searchText, then scroll the page down to this component on load
   */
  React.useEffect(() => {
    if (tasksQuery && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [tasksQuery, ref]);

  return (
    <Accordion
      ref={ref}
      expanded={isExpanded}
      onChange={(event, expanded) => setExpanded(expanded)}
      data-testid={dataTestIds.root}
    >
      <AccordionSummary expandIcon={<ExpandMore />} data-testid={dataTestIds.accordionSummary}>
        <Box display="flex" justifyContent="space-between" flex="1 1">
          <Typography variant="h6">Workbin Tasks</Typography>
          <TextField
            onClick={event => {
              // stop propagation to prevent accordion collapse/expand. we want to expand (if
              // not already expanded) when clicking in search field.
              event.stopPropagation();
              if (!isExpanded) {
                setExpanded(true);
              }
            }}
            onFocus={event => {
              // stop propagation to prevent focus on accordion bar, focus causes accordion bar to highlighted.
              event.stopPropagation();
            }}
            data-testid={dataTestIds.searchField}
            style={{ width: '300px' }}
            variant="standard"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            placeholder="Search tasks and actions..."
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" />,
              endAdornment: (
                <IconButton title="Clear" aria-label="Clear" size="small" onClick={() => setSearchText('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" flex="1 1">
          {searchText && (
            <Card raised className={classes.searchCard}>
              <CardContent className={classes.searchCardContent}>
                <Typography data-testid={dataTestIds.searchResultMessage} variant="h6">
                  {(currentTaskSearchCount + commonTaskSearchCount === 0 ? 'No ' : '') +
                    `Search Results for: ${searchText}`}
                </Typography>
              </CardContent>
            </Card>
          )}
          <Box className={classes.tasksContainer}>
            <Box className={classes.taskListContainer}>
              <CurrentTasks
                workspace={workspace}
                farmPath={currentFarmDefPath}
                searchText={searchText}
                searchResultCount={setCurrentTasksSearchCount}
                onTaskCompleted={onTaskCompleted}
              />
            </Box>
            <Box className={classes.taskListContainer}>
              <CommonTasksAndActions
                workspace={workspace}
                farmPath={currentFarmDefPath}
                searchText={searchText}
                searchResultCount={setCommonTasksSearchCount}
                onTaskCompleted={onTaskCompleted}
              />
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
