export type WorkbinDefinitionId = string;
export type WorkbinInstanceId = string;
export type WorkbinTaskChangelogId = string;
export type WorkbinPriority = 'SHIFT' | 'URGENT' | 'REGULAR';
export type WorkbinFieldTypes = 'TYPE_STRING' | 'TYPE_NUMBER' | 'CONTAINER_SERIAL' | 'DATE' | 'DEFAULT';
export type WorkbinTaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'FAILED';

export const PRODUCTION_LEAD_ROLE_NAME = 'hyp-production-production-lead';

export interface Workspace {
  role: string;
  userStoreRoleName: string; // name of the corresponding user store role.
  roleDisplayName: string;
}

export interface WorkbinTaskInstanceFilter {
  farm: string;
  workbin: string;
  createdAt?: string;
  createdAtBefore?: string;
  updatedAt?: string;
  updatedAtBefore?: string;
  statuses?: WorkbinTaskStatus[];
  resultForPassFailCheck?: boolean;
}

export interface WorkbinTaskDefinitionFilter {
  farm: string;
  workbin?: string;
  shortTitle?: string;
  defaultPriority?: WorkbinPriority;
  groupName?: string;
  definitionCreatedByInternalService?: boolean;
  hasPassFailCheck?: boolean;
}

export interface WorkbinTaskTriggerFilter {
  farm: string;
  groupName?: string;
  workbin?: string;
  description?: string;
}

export interface WorkbinDefinitionField {
  name: string;
  type: ProdActions.FundamentalFieldTypes; // ToDo: handle container_serial, date and default types
  options?: ProdActions.Options;
}

export interface WorkbinTaskDefinition {
  id: WorkbinDefinitionId;
  shortTitle: string;
  farm: string;
  title: string;
  description: string;
  sopLink: string;
  priority: WorkbinPriority;
  groups: WorkbinTaskTrigger[];
  workbins: string[];
  fields: WorkbinDefinitionField[];
  createdAt: string;
  updatedAt: string;
  scheduled: boolean;
  definitionCreatedByInternalService: boolean;
  hasPassFailCheck?: boolean;
}

export interface WorkbinTaskInstance {
  id: WorkbinInstanceId;
  workbinTaskDefinitionId: WorkbinDefinitionId;
  workbin: string;
  completer: string;
  description?: string;
  status: WorkbinTaskStatus;
  values: object;
  createdAt: string;
  updatedAt: string;
  resultForPassFailCheck?: boolean;
}

export interface WorkbinTaskChangelog {
  id: WorkbinTaskChangelogId;
  workbinTaskInstanceId: WorkbinInstanceId;
  creator: string;
  fieldName: string;
  previousValue: object;
  updatedValue: object;
  createdAt: string;
  updatedAt: string;
}

export interface WorkbinTaskTrigger {
  farm: string;
  ordering?: object;
  groupId?: string;
  groupName?: string;
  workbin?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnifiedWorkbinInstanceData {
  workbinTaskDefinition: WorkbinTaskDefinition;
  workbinTaskInstance: WorkbinTaskInstance;
  workbinTaskChangeLogs: WorkbinTaskChangelog[];
  workbinTaskComments: object[];
}
