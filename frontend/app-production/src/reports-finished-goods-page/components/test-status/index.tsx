import { CheckCircleOutline, HighlightOff, RemoveCircleOutline } from '@material-ui/icons';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { PackagingLotTestStatus } from '@plentyag/core/src/types';
import React, { useMemo } from 'react';
import { titleCase } from 'voca';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'test-status-root',
  current: 'test-status-current',
  overridden: 'test-status-overridden',
  noneIcon: 'test-status-none-icon',
  holdIcon: 'test-status-hold-icon',
  passIcon: 'test-status-pass-icon',
  failIcon: 'test-status-fail-icon',
};

export { dataTestIds as dataTestIdsTestingStatus };

export interface TestStatus {
  status: PackagingLotTestStatus;
  overriddenStatus?: PackagingLotTestStatus;
  'data-testid'?: string;
}

export const TestStatus: React.FC<TestStatus> = ({ status, overriddenStatus, 'data-testid': dataTestId }) => {
  const classes = useStyles({});

  const statusIconMap: Record<PackagingLotTestStatus, JSX.Element> = useMemo(
    () => ({
      [PackagingLotTestStatus.NONE]: (
        <RemoveCircleOutline data-testid={dataTestIds.noneIcon} className={classes.noneStatus} />
      ),
      [PackagingLotTestStatus.HOLD]: (
        <RemoveCircleOutline data-testid={dataTestIds.holdIcon} className={classes.holdStatus} />
      ),
      [PackagingLotTestStatus.PASS]: (
        <CheckCircleOutline data-testid={dataTestIds.passIcon} className={classes.passStatus} />
      ),
      [PackagingLotTestStatus.FAIL]: <HighlightOff data-testid={dataTestIds.failIcon} className={classes.failStatus} />,
    }),
    []
  );

  const wasOverridden =
    overriddenStatus && overriddenStatus !== PackagingLotTestStatus.NONE && overriddenStatus !== status;

  const currentStatusIcon = statusIconMap[wasOverridden ? overriddenStatus : status];
  const currentStatusText = titleCase(wasOverridden ? overriddenStatus : status);
  const oldStatusText = wasOverridden && titleCase(status);

  return (
    <Box display="flex" data-testid={dataTestId ?? dataTestIds.root}>
      {currentStatusIcon}
      <span className={classes.current} data-testid={dataTestIds.current}>
        {currentStatusText}
      </span>
      {oldStatusText && (
        <s className={classes.overridden} data-testid={dataTestIds.overridden}>
          {oldStatusText}
        </s>
      )}
    </Box>
  );
};
