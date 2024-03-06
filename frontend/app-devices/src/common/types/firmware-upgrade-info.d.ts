/**
 * DeviceWorkflowInfo is a Sprout entity.
 *
 * This is a POJO object, that we store in redis to persist information about devices between various pages.
 *
 * @see useRedisJsonObjectApi
 */
export interface DeviceWorkflowInfo {
  /**
   * Users can select multiple devices on the device dashboard page. They can kick-off various workflows base on the selected devices:
   * - upgrade firmware
   * - bulk placing devices
   * - bulk swapping devices
   * - more to come?
   *
   * To preserve the user's selection between pages we store the device ids, in this variable.
   */
  deviceIds: string[];

  /**
   * Additional information related to Device Firmware Upgrade (DFU).
   */
  firmwareUpgrade?: {
    /**
     * Store the processId returned when initiating a DFU for a group of device type.
     */
    processIdsByDeviceTypeGroup?: {
      [deviceTypeGroup: string]: string[];
    };
  };
}
