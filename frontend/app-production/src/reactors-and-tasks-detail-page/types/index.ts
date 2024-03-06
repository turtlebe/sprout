import { ReactorBehaviorTreeNode } from '@plentyag/app-production/src/common/types';

export type ReactorPath = string;

export interface ReactorState {
  [key: string]: any;
  subTasksExecutorsPaths?: { [uuid: string]: ReactorPath };
  trace?: ReactorBehaviorTreeNode;
}

export interface ReactorStateReturnType {
  state: ReactorState;
}
