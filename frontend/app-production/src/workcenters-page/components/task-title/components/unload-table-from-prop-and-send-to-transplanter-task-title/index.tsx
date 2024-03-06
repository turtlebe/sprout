import { ResourceLink } from '@plentyag/app-production/src/common/components';
import { Show } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsFromTaskInstance, getTaskParamValue, getTitle } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'unload-table-from-prop-and-send-to-transplater-task-title-root',
  unloadTitle: 'unload-table-from-prop-and-send-to-transplater-task-title-unload-title',
  tableLink: 'unload-table-from-prop-and-send-to-transplater-task-title-table-link',
  propPath: 'unload-table-from-prop-and-send-to-transplater-task-title-prop-path',
  sendTitle: 'unload-table-from-prop-and-send-to-transplater-task-title-send-title',
  pushTitle: 'unload-table-from-prop-and-send-to-transplater-task-title-push-title',
  rotateFromLevel: 'unload-table-from-prop-and-send-to-transplater-task-title-rotate-from-level',
};

export { dataTestIds as dataTestIdsUnloadTableFromPropAndSendToTransplanterTaskTitle };

/**
 * Renders title for task "Unload Table From Prop And Send To Transplanter"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Unload-Table-From-Prop-And-Send-To-Transplanter
 */
export const UnloadTableFromPropAndSendToTransplanterTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const unloadTitle = getTitle(task, { pending: 'Unload', running: 'Unloading', completed: 'Unloaded' });
  const sendTitle = getTitle(task, { pending: 'send', running: 'sending', completed: 'sent' });
  const pushTitle = getTitle(task, { pending: 'push', running: 'pushing', completed: 'pushed' });
  const taskInstanceParams = getTaskParamsFromTaskInstance(task);
  const tableSerial = getTaskParamValue('tableSerial', taskInstanceParams);
  const propLevelPath = getTaskParamValue('propLevelPath', taskInstanceParams);
  const propRack = getKindFromPath(propLevelPath, 'lines');
  const propLevel = getKindFromPath(propLevelPath, 'machines');
  const rotateTableFromLevelPath = getTaskParamValue('rotateTableFromLevelPath', taskInstanceParams);
  const rotateTableFromLevel = getKindFromPath(rotateTableFromLevelPath, 'machines');

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.unloadTitle}>{unloadTitle}&nbsp;</Typography>
      <ResourceLink
        data-testid={dataTestIds.tableLink}
        resourceName="Table"
        resourceId={tableSerial}
        openInNewTab={false}
      />
      <Typography>&nbsp;from</Typography>
      <BoxedTitle data-testid={dataTestIds.propPath} title={`${propRack}, ${propLevel}`} />
      <Typography data-testid={dataTestIds.sendTitle}>{`and ${sendTitle} trays to transplanter`}</Typography>
      <Show when={!!rotateTableFromLevel}>
        <Typography data-testid={dataTestIds.pushTitle}>&nbsp;{`then ${pushTitle} table from`}</Typography>
        <BoxedTitle data-testid={dataTestIds.rotateFromLevel} title={rotateTableFromLevel} />
        <Typography>into</Typography>
        <BoxedTitle title={propLevel} />
      </Show>
    </StyledBox>
  );
};
