import React from 'react';

type event = React.KeyboardEvent<HTMLElement>;
/**
 * Checks whether one of the provided keys is pressed in the event
 *
 * @param event
 * @param keyCode ex. [27]
 * @param key ex. ["Esc", "Escape"]
 */
export const checkEventKey = (
  event: event,
  keyCodes: event['keyCode'][],
  keys: event['key'][]
): boolean | undefined => {
  for (const keyCode of keyCodes) {
    if (event.which === keyCode || (event.charCode || event.keyCode) === keyCode) {
      return true;
    }
  }

  for (const key of keys) {
    if (event.key === key) {
      return true;
    }
  }
};
