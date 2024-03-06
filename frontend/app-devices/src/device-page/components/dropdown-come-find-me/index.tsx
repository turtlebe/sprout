import { Device } from '@plentyag/app-devices/src/common/types';
import { getDeviceRequestPath } from '@plentyag/app-devices/src/common/utils';
import { Dropdown, DropdownItem, DropdownItemText, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePostRequest } from '@plentyag/core/src/hooks';
import {
  getExecutiveServiceRequestUrl,
  getExecutiveServiceSubmitterHeaders,
  getScopedDataTestIds,
  parseErrorMessage,
} from '@plentyag/core/src/utils';
import React from 'react';

import { FindMeDuration } from './types';

export const SUCCESS_MESSAGE = '"Come Find Me" successfully started.';

// 1 Beat is equal to one LED Cycle that makes device blink. 3 cycles last 1 second.
const BEATS_PER_SECONDS = 3;
export const durations: FindMeDuration[] = [
  { label: '0 minutes - Off', value: 1 },
  { label: '5 minutes', value: 5 * BEATS_PER_SECONDS },
  { label: '15 minutes', value: 15 * BEATS_PER_SECONDS },
  { label: '30 minutes', value: 30 * BEATS_PER_SECONDS },
  { label: '45 minutes', value: 45 * BEATS_PER_SECONDS },
];

const dataTestIds = getScopedDataTestIds(
  {
    item: (duration: FindMeDuration) => `item-${duration.label}`,
  },
  'DropdownComeFindMe'
);

export const getDropdowmComeFindMeTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export { dataTestIds as dataTestIdsDropdownComeFindMe };

export interface DropdownComeFindMe {
  device: Device;
  associatedHathor: Device;
  'data-testid'?: string;
}

export const DropdownComeFindMe: React.FC<DropdownComeFindMe> = ({
  device,
  associatedHathor,
  'data-testid': dataTestId,
}) => {
  const dataTestIds = getDropdowmComeFindMeTestIds(dataTestId);
  const snackbar = useGlobalSnackbar();
  const [state] = useCoreStore();
  const { makeRequest } = usePostRequest({
    url: getExecutiveServiceRequestUrl(getDeviceRequestPath(associatedHathor, 'Hathor', 'CommandSprinkles')),
  });

  const handleClick = (duration: FindMeDuration) => {
    makeRequest({
      data: {
        ...getExecutiveServiceSubmitterHeaders(state),
        broadcast: false,
        farmdef_ids: [device.id],
        command: 'SPRINKLES_COME_FIND_ME',
        cfm_beats: duration.value,
      },
      onSuccess: () => {
        snackbar.successSnackbar(SUCCESS_MESSAGE);
      },
      onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
    });
  };

  return (
    <Dropdown data-testid={dataTestIds.root} variant="contained" color="primary" label="Find Me">
      {durations.map(duration => (
        <DropdownItem
          onClick={() => handleClick(duration)}
          key={duration.label}
          data-testid={dataTestIds.item(duration)}
        >
          <DropdownItemText primary={duration.label} />
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
