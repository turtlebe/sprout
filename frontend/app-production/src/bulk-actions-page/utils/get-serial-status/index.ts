import { SerialStatus } from '../../types';

export function getSerialStatus(state: ProdResources.ResourceState, currentGlobalSite: string): SerialStatus {
  if (!state) {
    return SerialStatus.invalidSerial;
  }

  if (state.location?.machine?.siteName !== currentGlobalSite) {
    return SerialStatus.invalidSerialSite;
  }

  return SerialStatus.valid;
}
