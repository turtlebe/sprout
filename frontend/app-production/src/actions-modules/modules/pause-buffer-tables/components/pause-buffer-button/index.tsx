import { Pause, PlayArrow } from '@material-ui/icons';
import { getDataModelFieldValue, getDataModelValue } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Button, ButtonGroup, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PAUSE_BUFFER_OUTFLOW_MODE_FIELD, PauseBufferOutflowModeChoices } from '../../types';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    tooltip: 'tooltip',
    play: 'play',
    pause: 'pause',
  },
  'pauseBufferButton'
);

export { dataTestIds as dataTestIdsPauseBufferButton };

export interface PauseBufferButton {
  actionModuleProps: ActionModuleProps;
  bufferName: string;
  isLoading: boolean;
}

export const PauseBufferButton: React.FC<PauseBufferButton> = ({ actionModuleProps, bufferName, isLoading }) => {
  const classes = useStyles({});
  const formik = actionModuleProps?.formik;

  const value = getDataModelValue(formik?.values, PAUSE_BUFFER_OUTFLOW_MODE_FIELD);
  const isPaused = value === PauseBufferOutflowModeChoices.PAUSE ? true : false;
  const invalidValue = !(value in PauseBufferOutflowModeChoices);
  const isDisabled = invalidValue || isLoading;
  const tooltipTitle = invalidValue ? (
    <Typography>
      The state cannot be changed for {bufferName}. The reactor state value can be either yes or no, but has value:{' '}
      {value}
    </Typography>
  ) : (
    ''
  );

  const handleChange = (isPaused: boolean) => {
    formik?.setFieldValue(
      PAUSE_BUFFER_OUTFLOW_MODE_FIELD,
      getDataModelFieldValue(isPaused ? PauseBufferOutflowModeChoices.PAUSE : PauseBufferOutflowModeChoices.PLAY)
    );
  };

  return (
    <Tooltip data-testid={dataTestIds.tooltip} arrow title={tooltipTitle}>
      <ButtonGroup disabled={isDisabled} size="small" variant="outlined">
        <Button
          data-testid={dataTestIds.pause}
          data-state={isPaused.toString()}
          onClick={() => handleChange(true)}
          className={isPaused ? classes.pauseButton : ''}
        >
          <Pause />
        </Button>
        <Button
          data-testid={dataTestIds.play}
          data-state={(!isPaused).toString()}
          onClick={() => handleChange(false)}
          className={isPaused ? '' : classes.playButton}
        >
          <PlayArrow />
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};
