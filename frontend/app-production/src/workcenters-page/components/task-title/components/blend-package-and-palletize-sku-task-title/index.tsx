import { isTaskPending, isTaskRunning } from '@plentyag/app-production/src/workcenters-page/utils';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { TaskTitleRendererProps } from '../../types';
import { getTaskParamsPayload, getTaskParamValue } from '../../utils';
import { BoxedTitle } from '../boxed-title';
import { StyledBox } from '../styled-box';

const dataTestIds = {
  root: 'blend-package-and-palletize-sku-task-title-root',
  processTitle: 'blend-package-and-palletize-sku-task-title-process-title',
  numberOfCases: 'blend-package-and-palletize-sku-task-title-number-of-cases',
  sku: 'blend-package-and-palletize-sku-task-title-sku',
};

export { dataTestIds as dataTestIdsBlendPackageAndPalletizeSkuTaskTitle };

/**
 * Renders title for task "Blend Package And Palletize Sku"
 * See render requirement details: https://plentyag.atlassian.net/wiki/spaces/EN/pages/2097152153/Workcenter+Task+Titles#Task%3A-Blend-Package-and-Palletize-SKU
 */
export const BlendPackageAndPalletizeSkuTaskTitle: React.FC<TaskTitleRendererProps> = ({ task }) => {
  const processTitle = isTaskPending(task)
    ? 'Blend and Palletize'
    : isTaskRunning(task)
    ? 'Blending and Palletizing'
    : 'Blended and Palletized';
  const taskParams = getTaskParamsPayload(task);
  const numberOfCases = getTaskParamValue('number_of_cases', taskParams);
  const sku = getTaskParamValue('sku', taskParams);

  return (
    <StyledBox data-testid={dataTestIds.root}>
      <Typography data-testid={dataTestIds.processTitle}>{processTitle}</Typography>
      <BoxedTitle data-testid={dataTestIds.numberOfCases} title={`${numberOfCases} cases`} />
      <Typography>of</Typography>
      <BoxedTitle data-testid={dataTestIds.sku} title={sku} />
    </StyledBox>
  );
};
