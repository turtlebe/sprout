import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PauseBufferOutflowModeChoices } from '../../types';

const dataTestIds = getScopedDataTestIds({}, 'Choice');

export { dataTestIds as dataTestIdsDisplay };

export interface Display {
  initialChoice: string;
  choice: string;
  currentCount?: number;
  goalCount?: number;
}

export const Display: React.FC<Display> = ({ initialChoice, choice, goalCount, currentCount }) => {
  const getValue = () => {
    switch (choice) {
      case PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT: {
        if (initialChoice === choice) {
          return `Playing ${currentCount}/${goalCount}...`;
        } else {
          return `Play ${goalCount} Carriers`;
        }
      }
      case PauseBufferOutflowModeChoices.PAUSE: {
        if (initialChoice === choice) {
          return 'Paused';
        } else {
          return 'Pause';
        }
      }
      case PauseBufferOutflowModeChoices.PLAY:
      default: {
        if (initialChoice === choice) {
          return 'Playing';
        } else {
          return 'Play';
        }
      }
    }
  };

  return <span data-testid={dataTestIds.root}>{getValue()}</span>;
};
