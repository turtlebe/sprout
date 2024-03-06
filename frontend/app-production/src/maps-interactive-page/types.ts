import { ContainerLocation } from '@plentyag/core/src/farm-def/types';
import { DateTime } from 'luxon';

export enum Sites {
  SSF2 = 'SSF2',
  LAX1 = 'LAX1',
}

/**
 * List of supported area classes of interactive maps
 */
export enum SupportedAreaClass {
  Germination = 'Germination',
  Propagation = 'Propagation',
  VerticalGrow = 'VerticalGrow',
}

/**
 * List of supported line classes of interactive maps
 */
export enum SupportedLineClass {
  GerminationLine = 'GerminationLine',
  PropRack = 'PropRack',
  PropagationRack = 'PropagationRack',
  GrowRoom = 'GrowRoom',
}

export enum SupportedMachineClass {
  GermStack = 'GermStack',
  GerminationChamber = 'GerminationChamber',
  GrowLane = 'GrowLane',
  GrowLine = 'GrowLine',
  PropRackLevel = 'PropRackLevel',
  TableLift = 'TableLift',
}

// TODO: move to "constants"
export const LineClassDisplayName = {
  [SupportedLineClass.GerminationLine]: 'Germination Lines',
  [SupportedLineClass.PropagationRack]: 'Propagation Racks',
  [SupportedLineClass.PropRack]: 'Propagation Racks',
  [SupportedLineClass.GrowRoom]: 'Grow Rooms',
};

export interface GrowLaneProperties {
  lane?: string;
}

/**
 * Supported lift types for propagation.
 */
export enum SupportedLiftTypes {
  HeadTableLift = 'HeadTableLift',
  TailTableLift = 'TailTableLift',
}

export type GetCropColor = (cropName: string) => string;

export interface ContainerState {
  resourceState: ProdResources.ResourceState;
  lastLoadOperation?: ProdResources.Operation;
}

export enum IrrigationStatus {
  CREATED = 'CREATED',
  ONGOING = 'ONGOING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CANCELLED = 'CANCELLED',
}

// these irrigation statuses do not exist in the backend, creating extension
// here for ui display purposes.
export enum InternalIrrigationStatus {
  UNSCHEDULED = 'UNSCHEDULED',
}

// indciates if a task was created manully or via a recipe?
export enum TaskType {
  MANUAL = 'MANUAL',
  RECIPE = 'RECIPE',
}

export enum IrrigationExecutionType {
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
}

export interface IrrigationTask {
  id: string;
  lotName: string;
  tableSerial: string;
  plannedStartDate: string; // ISO date
  plannedVolume: number;
  status: IrrigationStatus;
  executions: IrrigationExecution[];
  type: TaskType;
  rackPath: string;
  recipeDay?: number; // when task type is RECIPE, this value should be provided by backend.
}

// array containing list of executions for a given a task.
export interface IrrigationExecution {
  status: IrrigationStatus;
  executedTimestamp: string; // iso string when execution occurred.
  failureReason: string;
  type: IrrigationExecutionType;
  rack: number;
  level: number;
  bay: number;
}

export interface MapsState {
  [containerRef: string]: ContainerState & {
    conflicts?: ContainerState[];
    irrigationExecution?: IrrigationExecution;
    hasComments?: boolean;
  };
}

// TODO: move to "constants"
export const EMPTY_CONTAINER_COLOR = 'grey';

export interface ContainerData {
  containerLocation?: ContainerLocation;
  resourceState?: ProdResources.ResourceState;
  lastLoadOperation?: ProdResources.Operation;
  positionInParent?: string;
  conflicts?: ContainerState[];
  irrigationExecution?: IrrigationExecution;
}

export type ContainerEventHandler = (e?: Event, element?: Element, data?: ContainerData) => void;

export type AgeCohortDate = Date | 'all';

export interface QueryParameters {
  selectedDate: DateTime;
  ageCohortDate: AgeCohortDate;
  selectedCrops: string[];
  selectedLabels: string[];
  showSerials: boolean;
  showIrrigationLayer: boolean;
  showCommentsLayer: boolean;
}

export enum ContainerType {
  TRAY = 'TRAY',
  TABLE = 'TABLE',
  TOWER = 'TOWER',
}
