import { FarmDefMachine } from '@plentyag/core/src/farm-def/types';

/**
 * Direction of the track fo the grow lane at a birds-eye-view
 */
export enum GrowLaneDirection {
  RIGHT = 'RIGHT',
  RIGHT_DOWN = 'RIGHT_DOWN',
  LEFT = 'LEFT',
  LEFT_DOWN = 'LEFT_DOWN',
}

export interface ZoomState {
  moving?: boolean;
  machine?: FarmDefMachine;
}
