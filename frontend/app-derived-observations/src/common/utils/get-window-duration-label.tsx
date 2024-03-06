import { WindowDuration } from '@plentyag/core/src/types/derived-observations';

export function getWindowDurationLabel(windowDuration: WindowDuration): string {
  switch (windowDuration) {
    case WindowDuration.oneMinute:
      return '1 minute';
    case WindowDuration.fiveMinutes:
      return '5 minutes';
    case WindowDuration.tenMinutes:
      return '10 minutes';
    case WindowDuration.fifteenMinutes:
      return '15 minutes';
    case WindowDuration.thirtyMinutes:
      return '30 minutes';
    case WindowDuration.sixtyMinutes:
      return '60 minutes';
    default:
      return null;
  }
}
