import { TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PauseBufferOutflowModeChoices } from '../../types';

const dataTestIds = getScopedDataTestIds({ goalCountInput: 'goal-count-input' }, 'MenuChoice');

export { dataTestIds as dataTestIdsMenuChoice };

export interface MenuChoice {
  initialChoice: string;
  choice: string;
  initialGoalCount?: number;
  goalCount?: number;
  onGoalCountChange?: (e: any) => void;
  onGoalCountBlur?: (e: any) => void;
  'data-testid'?: string;
}

export const MenuChoice: React.FC<MenuChoice> = ({
  initialChoice = PauseBufferOutflowModeChoices.PLAY,
  choice,
  initialGoalCount,
  goalCount,
  onGoalCountChange,
  onGoalCountBlur,
  'data-testid': dataTestId,
}) => {
  const ChoicesSettings: Record<PauseBufferOutflowModeChoices, PauseBufferOutflowModeChoices[]> = {
    [PauseBufferOutflowModeChoices.PLAY]: [PauseBufferOutflowModeChoices.PLAY, PauseBufferOutflowModeChoices.PAUSE],
    [PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT]: [
      PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT,
      PauseBufferOutflowModeChoices.PAUSE,
    ],
    [PauseBufferOutflowModeChoices.PAUSE]: [
      PauseBufferOutflowModeChoices.PLAY,
      PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT,
      PauseBufferOutflowModeChoices.PAUSE,
    ],
  };

  const OutputMap: Record<PauseBufferOutflowModeChoices, React.ReactNode> = {
    [PauseBufferOutflowModeChoices.PLAY]: 'Play',
    [PauseBufferOutflowModeChoices.PAUSE]: 'Pause',
    [PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT]: (
      <>
        Play&nbsp;
        <span>
          <TextField
            data-testid={dataTestIds.goalCountInput}
            onClick={e => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            value={goalCount || initialGoalCount}
            onChange={onGoalCountChange}
            onBlur={onGoalCountBlur}
          />
        </span>
        &nbsp;Carriers
      </>
    ),
  };

  const choices = ChoicesSettings[initialChoice];
  if (choices.includes(choice)) {
    return <span data-testid={dataTestId || dataTestIds.root}>{OutputMap[choice]}</span>;
  }

  return null;
};
