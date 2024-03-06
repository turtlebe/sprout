import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';
import { CoreState } from '@plentyag/core/src/core-store/types';
import { getTowerDestinationFromPath } from '@plentyag/core/src/utils/get-tower-destination-from-path';
import { isNumber } from 'lodash';

import { getDataModelFieldValue, getInitialDataModelFromActionModel } from '../../shared/utils';
import { DataModel } from '../../types';

export const getCarrierIdInt = (carrierSerial: string): number => {
  // match only carriers with this serial format that is above 0
  const carrierIdMatch = carrierSerial.match(/(?<=CARRIER_)[1-9]\d*(?=_SERIAL)/g);
  return carrierIdMatch && parseInt(carrierIdMatch.pop());
};

export const getDataModelFromBufferCarrierState = (
  actionModel: ProdActions.ActionModel,
  bufferCarrierState: BufferState,
  coreState?: CoreState
): DataModel => {
  if (!bufferCarrierState) {
    return {};
  }

  const carrierSerial = bufferCarrierState.carrier_id;
  const carrierIdInt = getCarrierIdInt(carrierSerial);

  if (!isNumber(carrierIdInt)) {
    return {};
  }

  const toLocationValue = getTowerDestinationFromPath(bufferCarrierState.next_destination);

  return {
    ...getInitialDataModelFromActionModel(actionModel, coreState),
    carrier_id: carrierIdInt,
    to_location: getDataModelFieldValue(toLocationValue),
  };
};
