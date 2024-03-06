import { AlertRuleType } from '@plentyag/core/src/types/environment';

import { PATTERNS_DATA } from './constants';

export function getLinearGradientRotate(alertRuleType: AlertRuleType): number {
  return PATTERNS_DATA.find(pattern => pattern.name === alertRuleType).rotate + 90;
}
