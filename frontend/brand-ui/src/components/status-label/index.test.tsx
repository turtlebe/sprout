import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsStatusLabel as dataTestIds, StatusLabel, StatusLabelLevel } from '.';

describe('StatusLabel', () => {
  it.each([
    [
      StatusLabelLevel.IDLE,
      {
        text: 'NOT_STARTED',
        displayText: 'NOT STARTED',
        background: 'rgb(238, 238, 238)',
        color: 'rgb(110, 110, 110)',
      },
    ],
    [
      StatusLabelLevel.PENDING,
      {
        text: 'HOLD',
        displayText: 'HOLD',
        background: 'rgb(255, 233, 187)',
        color: 'rgb(66, 66, 66)',
      },
    ],
    [
      StatusLabelLevel.PROGRESSING,
      {
        text: 'RUNNING',
        displayText: 'RUNNING',
        background: 'rgb(209, 227, 255)',
        color: 'rgb(48, 63, 159)',
      },
    ],
    [
      StatusLabelLevel.SUCCESS,
      {
        text: 'COMPLETED',
        displayText: 'COMPLETED',
        background: 'rgb(191, 237, 191)',
        color: 'rgb(18, 110, 65)',
      },
    ],
    [
      StatusLabelLevel.FAILED,
      {
        text: 'SNAKE_CASE_TEST',
        displayText: 'SNAKE CASE TEST',
        background: 'rgb(239, 189, 204)',
        color: 'rgb(156, 7, 42)',
      },
    ],
  ])('renders label with %s color', (level, { text, displayText, background, color }) => {
    const { queryByTestId } = render(<StatusLabel level={level} text={text} />);

    expect(queryByTestId(dataTestIds.root)).toHaveStyle({
      background,
      color,
    });
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(displayText);
  });
});
