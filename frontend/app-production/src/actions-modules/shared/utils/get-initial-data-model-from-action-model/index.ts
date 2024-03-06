import { DataModel } from '@plentyag/app-production/src/actions-modules/types';
import { CoreState } from '@plentyag/core/src/core-store/types';
import { getExecutiveServiceSubmitterHeaders } from '@plentyag/core/src/utils';

import { getEmptyValue } from '../get-and-set-value';

export const getInitialDataModelFromActionModel = (
  actionModel: ProdActions.ActionModel,
  state?: CoreState
): DataModel =>
  actionModel?.fields?.reduce((acc, field) => {
    acc[field.name] = getEmptyValue(field.type);
    return acc;
  }, getExecutiveServiceSubmitterHeaders(state)) || {};
