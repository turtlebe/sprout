import { ReactorBehaviorTreeNode } from './reactor-behavior-tree-node';
import { WorkbinTaskInstance } from './workspace';
export interface Workcenter {
  name: string;
  path: string;
  displayName: string;
}

/**
 * Action for the associated workcenter
 * Note: in the UI these are called "Workcenter Tasks"
 */
export interface WorkcenterAction {
  name: string;
  path: string; // farm def path to workcenter action/task
}

export interface WorkcenterDetails extends Workcenter {
  actions: WorkcenterAction[];
}

export enum TaskStatus {
  CREATED = 'CREATED',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED', // maps to completed state in ui
  CANCELLING = 'CANCELLING', // maps to running state in ui
  CANCELED = 'CANCELED', // maps to completed state in ui
}

export enum PlanStatus {
  CREATED = 'CREATED', // plan created but execution not started
  RUNNING = 'RUNNING', // plan started execution
  PAUSED = 'PAUSED', // ex: task failed, pausing plan, user can re-execute
  COMPLETED = 'COMPLETED', // plan completed execution of all tasks - no more tasks can be started.
  FAILED = 'FAILED', // typically get into state when exception occurs in ES - contact farmos for help.
}

export enum SummaryStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING',
  CANCELED = 'CANCELED',
}

type UUID = string;

export interface WorkcenterTaskDetails {
  id: UUID;
  taskPath: string; // farm def path
  taskParametersJsonPayload: string; // json encoded task parameters object
  workcenter: string; // farm def path
  planId: string;
  title: string;
}

/**
 * Holds summary information for either a task, subtask or plan.
 */
export interface SummaryEntry {
  status: SummaryStatus;
  description: string;
}

export type Summary = SummaryEntry[];
export interface WorkcenterPlan {
  id: string;
  workcenter: string; // farm def path
  plannedDate: string; // 2021-01-21
  taskOrdering: UUID[];
  status: PlanStatus;
  progress: number;
  summary: Summary;
}

export interface TaskInstanceBase {
  id: string;
  type: string;
  displayTitle: string;
  taskParams?: object;
  parentTaskId?: string;
}

export interface WorkbinInstance extends TaskInstanceBase {
  taskDetails: WorkbinTaskInstance;
}

/**
 * When a task (or subtask) is executing this holds details about it's state.
 *
 * Note: Some APIs are returning the "createdAt" field as Epoch seconds or as ISO String
 * The use of generics here to declare the "createdAt" type.  As we update the APIs
 * to use the correct format of ISO String, we can make the change in the respective uses
 * to make sure the types are right.
 */
export interface DurativeTaskState<DATETYPE = number | string> {
  taskStatus: TaskStatus;
  statusOfLastActCycle: SummaryEntry;
  summary: Summary;
  /**
   * Subtask ids
   * Can get DurativeTaskState for each subtask and show status and summary.
   */
  subtaskIds: string[]; // from subtask ids,
  createdAt: DATETYPE;
  taskInstance: TaskInstanceBase | WorkbinInstance;
  executingReactorPath: string;
  btExecutionTrace?: ReactorBehaviorTreeNode;
}

/**
 * API response when getting info about a task.
 */
export interface WorkcenterTaskDetailsResponse {
  taskDetails: WorkcenterTaskDetails;
  /**
   * If the task is executing or was executed at some point, this would hold more details about
   * the execution
   */
  executionDetails?: DurativeTaskState;
}

/**
 * API response when getting details about a plan.
 */
export interface WorkcenterPlanResponse {
  plan: WorkcenterPlan;
  detailsOfTasksFromPlan: WorkcenterTaskDetailsResponse[];
}

export type CreateOrUpdateTask = CreateTask | UpdateTask;

// when creating a task - only need taskPath.
export interface CreateTask {
  isUpdating: false;
  taskPath: string;
}

// when updating task must also include taskId and taskParametersJsonPayload
export interface UpdateTask {
  isUpdating: true;
  taskPath: string;
  taskId: string;
  taskParametersJsonPayload: string;
}
