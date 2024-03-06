import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDisplay as dataTestIds, Display } from './display';

describe('Display', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('renders in paused state', () => {
      // ACT
      const { queryByTestId } = render(<Display initialChoice={'PAUSE'} choice={'PAUSE'} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Paused');
    });

    it('renders in play with goal count state', () => {
      // ACT
      const { queryByTestId } = render(
        <Display
          initialChoice={'PLAY_WITH_GOAL_COUNT'}
          choice={'PLAY_WITH_GOAL_COUNT'}
          currentCount={5}
          goalCount={5}
        />
      );

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Playing 5/5...');
    });

    it('renders in play state', () => {
      // ACT
      const { queryByTestId } = render(<Display initialChoice={'PLAY'} choice={'PLAY'} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Playing');
    });

    it('default to play state if invalid choice', () => {
      // ACT
      const { queryByTestId } = render(<Display initialChoice={undefined} choice={undefined} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Playing');
    });
  });

  describe('changed state', () => {
    it('renders in pause state', () => {
      // ACT
      const { queryByTestId } = render(<Display initialChoice={'PLAY'} choice={'PAUSE'} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Pause');
    });

    it('renders in play with goal count state', () => {
      // ACT
      const { queryByTestId } = render(
        <Display initialChoice={'PAUSE'} choice={'PLAY_WITH_GOAL_COUNT'} currentCount={5} goalCount={5} />
      );

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Play 5 Carriers');
    });

    it('renders in play state', () => {
      // ACT
      const { queryByTestId } = render(<Display initialChoice={'PAUSE'} choice={'PLAY'} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Play');
    });

    it('default to play state if invalid choice', () => {
      // ACT
      const { queryByTestId } = render(<Display initialChoice={'PLAY'} choice={undefined} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Play');
    });
  });
});
