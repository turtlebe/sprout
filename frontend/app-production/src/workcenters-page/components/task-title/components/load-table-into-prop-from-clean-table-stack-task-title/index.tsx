import { ResourceLink } from '@plentyag/app-production/src/common/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTaskParamValue, getTitle } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'load-table-into-prop-from-clean-table-stack-task-title-root',
  loadTitle: 'load-table-into-prop-from-clean-table-stack-task-title-load-title',
  tableLink: 'load-table-into-prop-from-clean-table-stack-task-title-table-link',
  propPath: 'load-table-into-prop-from-clean-table-stack-task-title-prop-path',
};

export { dataTestIds as dataTestIdsLoadTableIntoPropFromCleanTableStackTaskTitle };

/**
 * Renders title for task "Load Table Into Prop From Clean Table Stack"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Load-Table-Into-Prop-From-Clean-Table-Stack
 */
export const LoadTableIntoPropFromCleanTableStackTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const loadTitle = getTitle(task, { pending: 'Load', running: 'Loading', completed: 'Loaded' });

  const taskParams = getTaskParamsPayload(task);
  const tableSerial = getTaskParamValue('table_serial', taskParams);
  const propLevelPath = getTaskParamValue('prop_level_path', taskParams);
  const propRack = getKindFromPath(propLevelPath, 'lines');
  const propLevel = getKindFromPath(propLevelPath, 'machines');

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.loadTitle}>{loadTitle}&nbsp;</Typography>
      <ResourceLink
        data-testid={dataTestIds.tableLink}
        resourceName="Table"
        resourceId={tableSerial}
        openInNewTab={false}
      />
      <Typography>&nbsp;from clean stack to</Typography>
      <BoxedTitle data-testid={dataTestIds.propPath} title={`${propRack}, ${propLevel}`} />
    </StyledBox>
  );
};
