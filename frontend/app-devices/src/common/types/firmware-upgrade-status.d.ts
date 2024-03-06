/**
 * FirmwareUpgradeStatus is a Device Management Service entity.
 *
 * It holds status information of a firmware upgrade for a given device.
 */
export interface FirmwareUpgradeStatus {
  createdAt: string;
  deviceId: string;
  status: {
    name: string;
  };
}
