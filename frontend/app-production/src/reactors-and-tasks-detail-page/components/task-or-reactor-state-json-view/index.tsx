import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getReactorsAndTasksDetailPath } from '@plentyag/app-production/src/common/utils';
import { MarkdownExtended } from '@plentyag/brand-ui/src/components/markdown-extended';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { ReactorPath } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  jsonView: 'reactor-state-json-view-root',
};

export { dataTestIds as dataTestIdsTaskOrReactorStateJsonView };

export interface TaskOrReactorStateJsonView {
  state?: { [key: string]: any };
  reactorPath?: ReactorPath;
}

/**
 * Provides a JSON view of the state object.
 * Links to subtasks are replaced with anchor tags so the user can navigate to them.
 * @state The state object to view.
 * @returns React component displaying json.
 */
export const TaskOrReactorStateJsonView: React.FC<TaskOrReactorStateJsonView> = ({ state, reactorPath }) => {
  const classes = useStyles();
  const { reactorsAndTasksDetailBasePath } = useAppPaths();

  function replacer(this: any, key: string, value: any): any {
    // replace all reactor paths in object field 'subTasksExecutorsPaths' with link that
    // will open to reactor state.
    if (reactorsAndTasksDetailBasePath && key === 'subTasksExecutorsPaths') {
      const replacements = {};
      Object.keys(value).forEach(uuid => {
        const url = getReactorsAndTasksDetailPath({ reactorsAndTasksDetailBasePath, reactorPath: value[uuid] });
        replacements[uuid] = `<InternalLink href='${url}'>View Reactor State</InternalLink>`;
      });
      return replacements;
    }

    // replace the id (key in object "activeTasks") with a link that allows user to view task details.
    //
    // original data:
    // "activeTasks": {
    //    "d8630544-f631-47c7-b513-9ed9774f8d57": { ... }
    //    "548e8c88-e874-4126-ad05-873f11631da8": { ... }
    // }
    //
    // will become:
    // "activeTasks": {
    //    "<InternalLink href='/reactor-tasks?taskId=d8630544-f631-47c7-b513-9ed9774f8d57'>d8630544-f631-47c7-b513-9ed9774f8d57</InternalLink>": { ... }
    //    "<InternalLink href='/reactor-tasks?taskId=548e8c88-e874-4126-ad05-873f11631da8'>548e8c88-e874-4126-ad05-873f11631da8</InternalLink>": { ... }
    // }
    // then the markdown converter will turn into actual links the user can click.
    if (reactorsAndTasksDetailBasePath && key === 'activeTasks') {
      const replacements = {};
      Object.keys(value).forEach(taskId => {
        const url = getReactorsAndTasksDetailPath({ reactorsAndTasksDetailBasePath, reactorPath, taskId });
        const newTaskIdInLink = `<InternalLink href='${url}'>${taskId}</InternalLink>`;
        replacements[newTaskIdInLink] = value[taskId];
      });
      return replacements;
    }
    return value;
  }

  return state ? (
    <Typography data-testid={dataTestIds.jsonView} className={classes.jsonContainer} component="pre">
      <MarkdownExtended>{JSON.stringify(state, replacer, 2)}</MarkdownExtended>
    </Typography>
  ) : null;
};
