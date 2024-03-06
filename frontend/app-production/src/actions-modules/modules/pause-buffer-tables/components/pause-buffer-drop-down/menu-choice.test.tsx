import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { PauseBufferOutflowModeChoices } from '../../types';

import { dataTestIdsMenuChoice as dataTestIds, MenuChoice } from './menu-choice';

describe('MenuChoice', () => {
  it.each([
    // Play scenario
    [PauseBufferOutflowModeChoices.PLAY, PauseBufferOutflowModeChoices.PLAY, true],
    [PauseBufferOutflowModeChoices.PLAY, PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, false],
    [PauseBufferOutflowModeChoices.PLAY, PauseBufferOutflowModeChoices.PAUSE, true],

    // Default scenario: play
    [undefined, PauseBufferOutflowModeChoices.PLAY, true],
    [undefined, PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, false],
    [undefined, PauseBufferOutflowModeChoices.PAUSE, true],

    // Play with Goal Count scenario
    [PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, PauseBufferOutflowModeChoices.PLAY, false],
    [PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, true],
    [PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, PauseBufferOutflowModeChoices.PAUSE, true],

    // Pause scenario
    [PauseBufferOutflowModeChoices.PAUSE, PauseBufferOutflowModeChoices.PLAY, true],
    [PauseBufferOutflowModeChoices.PAUSE, PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, true],
    [PauseBufferOutflowModeChoices.PAUSE, PauseBufferOutflowModeChoices.PAUSE, true],
  ])(
    'should show correct result for %s when choice is %s',
    (initialChoice: PauseBufferOutflowModeChoices, choice: PauseBufferOutflowModeChoices, toBeInDocument: boolean) => {
      // ACT
      const { queryByTestId } = render(
        <MenuChoice
          initialChoice={initialChoice}
          choice={choice}
          initialGoalCount={10}
          goalCount={5}
          onGoalCountChange={jest.fn()}
          onGoalCountBlur={jest.fn()}
        />
      );

      // ASSERT
      if (toBeInDocument) {
        expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      } else {
        expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
      }
    }
  );

  describe('interactions for play with goal count choice', () => {
    it('fire events when play with goal count text input has changed', async () => {
      // ARRANGE
      const mockGoalCountChange = jest.fn();
      const mockGoalCountBlur = jest.fn();
      const { queryByTestId } = render(
        <MenuChoice
          initialChoice={PauseBufferOutflowModeChoices.PAUSE}
          choice={PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT}
          initialGoalCount={10}
          goalCount={5}
          onGoalCountChange={mockGoalCountChange}
          onGoalCountBlur={mockGoalCountBlur}
        />
      );

      // ACT
      const inputEl = queryByTestId(dataTestIds.goalCountInput).querySelector('input');
      await actAndAwait(() => fireEvent.change(inputEl, { target: { value: 9 } }));
      await actAndAwait(() => fireEvent.blur(inputEl));

      // ASSERT
      expect(mockGoalCountChange).toHaveBeenCalled();
      expect(mockGoalCountBlur).toHaveBeenCalled();
    });
  });
});
