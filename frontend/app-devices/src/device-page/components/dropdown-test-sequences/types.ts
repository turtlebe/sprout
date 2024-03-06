import { Device } from '@plentyag/app-devices/src/common/types';

export enum TestSequenceName {
  verticalGrowShortLightingTest = 'Short Lighting Test Sequence',
  verticalGrowLongLightingTest = 'Long Lighting Test Sequence',
  propagationLightingTest = 'Prop Lighting Test Sequence',
  sprinkleTest = 'Sprinkles Test Sequence',
}

export interface TestSequence {
  name: TestSequenceName;
  getRequestUrl: (device: Device) => string;
  getRequestData: () => object;
  showTestSequence: (device: Device) => boolean;
}
