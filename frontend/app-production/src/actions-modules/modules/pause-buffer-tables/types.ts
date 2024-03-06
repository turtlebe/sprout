// state of an individual buffer in reactor: sites/LAX1/areas/TowerAutomation/lines/TransferConveyance
export interface BufferState {
  bufferOutflowPaused: boolean;
  bufferPath: string;
  outflowPausable: boolean;
  carrierIds?: number[];
  goalCount?: number;
}

// transfer conveynance buffers displayed in the settings page under pausable buffers.
export type BufferTypes =
  | 'SeedlingBuffer'
  | 'CutagainBuffer'
  | 'PickupBuffer'
  | 'AuxBuffer1'
  | 'AuxBuffer2'
  | 'EmptyCarrierBuffer'
  | 'PreInspectionBuffer';

export enum BufferCategories {
  'Loading' = 'Loading',
  'Empty' = 'Empty',
  'Unloading' = 'Unloading',
}

// ToDo: eventually this mapping will come from the backend, but for now
// hardcoding in the frontend.
export const mapBufferNameToCategory: Record<BufferTypes, BufferCategories> = {
  SeedlingBuffer: BufferCategories.Loading,
  PickupBuffer: BufferCategories.Empty,
  CutagainBuffer: BufferCategories.Loading,
  AuxBuffer1: BufferCategories.Unloading,
  AuxBuffer2: BufferCategories.Unloading,
  EmptyCarrierBuffer: BufferCategories.Empty,
  PreInspectionBuffer: BufferCategories.Unloading,
};

// "Pause Buffer OutFlow" field in action:
// sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/interfaces/Requests/methods/PauseBufferOutflow
export const PAUSE_BUFFER_OUTFLOW_FIELD = 'pause_buffer_outflow';
export enum PauseBufferOutflowChoices {
  YES = 'yes',
  NO = 'no',
}

// "Pause Buffer Outflow Mode" field in action:
// sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/interfaces/Requests/methods/PauseBufferOutflow
export const PAUSE_BUFFER_OUTFLOW_MODE_FIELD = 'pause_buffer_outflow_mode';
export const PAUSE_BUFFER_PLAY_COUNT_GOAL = 'goal_count';
export enum PauseBufferOutflowModeChoices {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  PLAY_WITH_GOAL_COUNT = 'PLAY_WITH_GOAL_COUNT',
}
