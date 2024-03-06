import { DeviceLocation } from '@plentyag/core/src/farm-def/types';

export interface Device {
  deviceTypeName:
    | 'BaslerACA308816gc'
    | 'BaslerACA402429uc'
    | 'BaslerACA54725gc'
    | 'BaslerACA40248gc'
    | 'BaslerA2A384013gc'
    | 'BaslerBlaze101'
    | 'Coco'
    | 'FramosD435e'
    | 'RealsenseSR305'
    | 'Hathor'
    | 'Sprinkle'
    | 'YSI'
    | 'Sprinkle2Base'
    | 'Sprinkle2FIR'
    | 'Sprinkle2CO2'
    | 'LuminaireWalalight'
    | 'LuminaireEuphoria'
    | 'IOLinkMasterAL1323'
    | 'IOLinkInputOutputModuleAL2605'
    | 'CHLOe'
    | 'UPSquared';
  id: string;
  kind: 'device';
  location: DeviceLocation;
  measurements: any;
  path: string;
  properties: any;
  serial: string;
}
