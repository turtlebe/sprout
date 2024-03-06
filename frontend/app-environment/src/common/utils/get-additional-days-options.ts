import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { times } from 'lodash';

import { getAdditionalDaysLabel } from './get-additional-days-label';

export function getAdditionalDaysOptions(repeatInterval: number) {
  return times(Math.ceil(repeatInterval / ONE_DAY), i => i).map(i => ({
    label: getAdditionalDaysLabel(i),
    value: i,
  }));
}
