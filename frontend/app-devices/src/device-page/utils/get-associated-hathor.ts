import { Device } from '../../common/types';
import { isHathorDevice } from '../../common/utils';

export function getAssociatedHathor(associatedDevices: Device[] = []) {
  return associatedDevices?.find(isHathorDevice);
}
