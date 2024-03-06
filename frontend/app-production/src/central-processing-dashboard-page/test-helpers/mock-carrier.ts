import { BufferState } from '@plentyag/app-production/src/central-processing-dashboard-page/types/buffer-state';

// mock of carriers held in at a zone
export const mockCarriers: BufferState[] = [
  {
    buffer_position: 0,
    carrier_id: 'CARRIER_64_SERIAL',
    carrier_type: 'LOADED_CARRIER',
    crop: 'BAC',
    next_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/Zone1R',
    final_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/Zone1R',
    tower_id: '800-00011957:TOW:000-002-159',
    tower_labels: [],
  },
  {
    buffer_position: 0,
    carrier_id: 'CARRIER_55_SERIAL',
    carrier_type: 'LOADED_CARRIER',
    crop: 'CRC',
    next_destination: null,
    final_destination: null,
    tower_id: '800-00011957:TOW:000-002-779',
    tower_labels: [],
  },
  {
    buffer_position: 1,
    carrier_id: 'CARRIER_10_SERIAL',
    carrier_type: 'LOADED_CARRIER',
    crop: 'CRC',
    next_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/SeelingBuffer',
    final_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/SeelingBuffer',
    tower_id: '800-00011957:TOW:000-003-000',
    tower_labels: ['Wilted'],
  },
];

// mock of carriers that will be in a buffer (i.e. seedling)
export const mockBufferCarriers: BufferState[] = [
  {
    buffer_position: 0,
    carrier_id: 'CARRIER_24_SERIAL',
    carrier_type: 'LOADED_CARRIER',
    crop: 'BAC',
    next_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/AuxBuffer1',
    final_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/AuxBuffer2',
    tower_id: '800-00011957:TOW:000-002-159',
    tower_labels: [],
  },
  {
    buffer_position: 0,
    carrier_id: 'CARRIER_8_SERIAL',
    carrier_type: 'LOADED_CARRIER',
    crop: 'CRC',
    next_destination: null,
    tower_id: '800-00011957:TOW:000-002-779',
    tower_labels: [],
  },
  {
    buffer_position: 1,
    carrier_id: 'CARRIER_32_SERIAL',
    carrier_type: 'LOADED_CARRIER',
    crop: 'CRC',
    next_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/GR23A',
    final_destination:
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/GR23B',
    tower_id: '800-00011957:TOW:000-003-000',
    tower_labels: ['not-for-vg'],
  },
];
