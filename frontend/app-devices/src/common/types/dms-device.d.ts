import { Device } from './device';

export interface DmsDevice extends Device {
  deviceState: string;
  appFirmwareVersion: string;
  bootloaderFirmwareVersion: string;
  hasCertificate: boolean;
  certificateCreatedAt?: string;
  key?: string;
  properties: {
    deviceAddress?: string;
    macAddress?: string;
  };
}
