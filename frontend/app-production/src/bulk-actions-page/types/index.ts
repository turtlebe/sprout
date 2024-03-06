export enum SerialStatus {
  invalidSerial = 'invalid serial',
  invalidSerialSite = 'invalid serial - site must match global site',
  valid = 'valid',
}
export interface Container {
  isSelected: boolean;
  serial: string;
  serialStatus: SerialStatus; // is serial valid or not.
  // if serial is valid then will contain a resource state.
  resourceState?: ProdResources.ResourceState;
}

export enum ActionStatus {
  success = 'success',
  fail = 'fail',
}
export interface ContainerActionResult extends Container {
  status: ActionStatus;
  message?: string; // message if failed.
}
