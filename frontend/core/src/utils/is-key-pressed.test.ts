import React from 'react';

import { isKeyPressed } from './is-key-pressed';

function buildKeyEvent(key) {
  return { key } as unknown as React.KeyboardEvent<HTMLElement>;
}

describe('isKeyPressed', () => {
  it('returns falses', () => {
    const keyEvent = buildKeyEvent('');

    expect(isKeyPressed(keyEvent)).toEqual({
      isArrowLeftPressed: false,
      isArrowRightPressed: false,
      isMinusPressed: false,
      isEqualsPressed: false,
      isEnterPressed: false,
      isEscapePressed: false,
      isMetaPressed: false,
    });
  });

  it.each(['ArrowLeft', 'ArrowRight', 'Minus', 'Equals', 'Enter', 'Escape', 'Meta'])(
    'returns true for is%sPressed',
    key => {
      const keyEvent = buildKeyEvent(key);

      expect(isKeyPressed(keyEvent)).toEqual({
        isArrowLeftPressed: false,
        isArrowRightPressed: false,
        isMinusPressed: false,
        isEqualsPressed: false,
        isEnterPressed: false,
        isEscapePressed: false,
        isMetaPressed: false,
        [`is${key}Pressed`]: true,
      });
    }
  );
});
