import { Device } from '@plentyag/app-devices/src/common/types';
import { getDeviceRequestPath } from '@plentyag/app-devices/src/common/utils';
import {
  DialogConfirmation,
  Dropdown,
  DropdownItem,
  DropdownItemText,
  getDialogConfirmationDataTestIds,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePostRequest } from '@plentyag/core/src/hooks';
import {
  getExecutiveServiceRequestUrl,
  getExecutiveServiceSubmitterHeaders,
  getScopedDataTestIds,
  parseErrorMessage,
} from '@plentyag/core/src/utils';
import React from 'react';

import { TestSequence, TestSequenceName } from './types';

const dataTestIds = getScopedDataTestIds(
  {
    buttonTestSequence: (name: TestSequenceName) => `button-test-sequence-${name}`,
    dialogConfirmation: getDialogConfirmationDataTestIds('testSequenceConfirmation'),
  },
  'DropdownTestSequences'
);

export const getDropdownTestSequencesTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export { dataTestIds as dataTestIdsDropdownTestSequences };

export interface DropdownTestSequences {
  device: Device;
  'data-testid'?: string;
}

export const testSequences: TestSequence[] = [
  {
    name: TestSequenceName.verticalGrowShortLightingTest,
    getRequestUrl: device => getExecutiveServiceRequestUrl(getDeviceRequestPath(device, 'Hathor', 'VgSequenceTest')),
    getRequestData: () => ({ channelDuration: 4000 }),
    showTestSequence: device =>
      device?.location?.path?.includes('sites/TEST') || device?.location?.path?.includes('VerticalGrow'),
  },
  {
    name: TestSequenceName.verticalGrowLongLightingTest,
    getRequestUrl: device => getExecutiveServiceRequestUrl(getDeviceRequestPath(device, 'Hathor', 'VgSequenceTest')),
    getRequestData: () => ({ channelDuration: 30000 }),
    showTestSequence: device =>
      device?.location?.path?.includes('sites/TEST') || device?.location?.path?.includes('VerticalGrow'),
  },
  {
    name: TestSequenceName.propagationLightingTest,
    getRequestUrl: device => getExecutiveServiceRequestUrl(getDeviceRequestPath(device, 'Hathor', 'PropSequenceTest')),
    getRequestData: () => ({ channelDuration: 4000 }),
    showTestSequence: device =>
      device?.location?.path?.includes('sites/TEST') || device?.location?.path?.includes('Propagation'),
  },
  {
    name: TestSequenceName.sprinkleTest,
    getRequestUrl: device => getExecutiveServiceRequestUrl(getDeviceRequestPath(device, 'Hathor', 'CommandSprinkles')),
    getRequestData: () => ({ cfm_beats: 5, command: 'SPRINKLES_COME_FIND_ME', broadcast: true }),
    showTestSequence: () => true,
  },
];

/**
 * Dropdown that offers the ability to run "Test Sequences" for the given Device through ExecutiveService.
 *
 * Each Test Sequence is an ExecutiveService Request.
 *
 * For example, from a Hathor we can trigger a Lighting Test Sequence that turns on all the Luminaire
 * one by one in a sequential in order to verify that they are connected and wired correctly to their Hathor device.
 */
export const DropdownTestSequences: React.FC<DropdownTestSequences> = ({ device, 'data-testid': dataTestId }) => {
  const dataTestIds = getDropdownTestSequencesTestIds(dataTestId);
  const [testSequence, setTestSequence] = React.useState<TestSequence>(null);
  const { makeRequest } = usePostRequest({});
  const snackbar = useGlobalSnackbar();
  const [state] = useCoreStore();

  const handleConfirm = () => {
    makeRequest({
      url: testSequence.getRequestUrl(device),
      data: { ...testSequence.getRequestData(), ...getExecutiveServiceSubmitterHeaders(state) },
      onSuccess: () => {
        snackbar.successSnackbar(`${testSequence.name} successfully started.`);
        setTestSequence(null);
      },
      onError: error => snackbar.errorSnackbar({ message: parseErrorMessage(error) }),
    });
  };

  return (
    <>
      <Dropdown data-testid={dataTestIds.root} variant="contained" color="default" label="Test Sequences">
        {testSequences
          .filter(testSequence => testSequence.showTestSequence(device))
          .map(testSequence => (
            <DropdownItem
              onClick={() => setTestSequence(testSequence)}
              key={testSequence.name}
              data-testid={dataTestIds.buttonTestSequence(testSequence.name)}
            >
              <DropdownItemText primary={testSequence.name} />
            </DropdownItem>
          ))}
      </Dropdown>
      {testSequence && (
        <DialogConfirmation
          data-testid={dataTestIds.dialogConfirmation.root}
          open={Boolean(testSequence)}
          title={`You are about to execute a ${testSequence.name} ?`}
          confirmLabel="Continue"
          onConfirm={handleConfirm}
          onCancel={() => setTestSequence(null)}
        />
      )}
    </>
  );
};
