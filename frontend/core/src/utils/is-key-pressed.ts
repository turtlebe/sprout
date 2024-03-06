import { checkEventKey } from './check-event-key';

export interface IsKeyPressedReturn {
  isArrowLeftPressed: boolean;
  isArrowRightPressed: boolean;
  isMinusPressed: boolean;
  isEqualsPressed: boolean;
  isEnterPressed: boolean;
  isEscapePressed: boolean;
  isMetaPressed: boolean;
}

export function isKeyPressed(keyEvent): IsKeyPressedReturn {
  const isArrowLeftPressed = Boolean(checkEventKey(keyEvent, [37], ['ArrowLeft']));
  const isArrowRightPressed = Boolean(checkEventKey(keyEvent, [39], ['ArrowRight']));
  const isMinusPressed = Boolean(checkEventKey(keyEvent, [189], ['Minus']));
  const isEqualsPressed = Boolean(checkEventKey(keyEvent, [187], ['Equals']));
  const isEnterPressed = Boolean(checkEventKey(keyEvent, [13], ['Enter']));
  const isEscapePressed = Boolean(checkEventKey(keyEvent, [27], ['Escape']));
  const isMetaPressed = Boolean(checkEventKey(keyEvent, [93], ['Meta']));

  return {
    isArrowLeftPressed,
    isArrowRightPressed,
    isMinusPressed,
    isEqualsPressed,
    isEnterPressed,
    isEscapePressed,
    isMetaPressed,
  };
}
