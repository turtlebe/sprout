export enum PermissionLevels {
  'UNKNOWN' = 0,
  'NONE' = 1,
  'READ_SELF' = 2,
  'EDIT_SELF' = 3,
  'READ_WITH_ID' = 4,
  'READ_AND_LIST' = 5,
  'EDIT' = 6,
  'FULL' = 7,
  'GOD' = 8, // @todo remove before merging
}

export enum Resources {
  'HYP_BETA' = 'HYP_BETA',
  'HYP_CROPS' = 'HYP_CROPS',
  'HYP_DERIVED_OBSERVATIONS' = 'HYP_DERIVED_OBSERVATIONS',
  'HYP_ENVIRONMENT_V2' = 'HYP_ENVIRONMENT_V2',
  'HYP_IGNITION_TAG_REGISTRY' = 'HYP_IGNITION_TAG_REGISTRY',
  'HYP_LAB_TESTING' = 'HYP_LAB_TESTING',
  'HYP_PERCEPTION' = 'HYP_PERCEPTION',
  'HYP_PRODUCTION' = 'HYP_PRODUCTION',
  'HYP_PRODUCTION_ADMIN' = 'HYP_PRODUCTION_ADMIN',
  'HYP_QUALITY' = 'HYP_QUALITY',
  'HYP_SENSORY' = 'HYP_SENSORY',
  'HYP_TRACEABILITY' = 'HYP_TRACEABILITY',
  'HYP_DEVELOPER' = 'HYP_DEVELOPER',
  // add more as needed.
}

/* Current User */
export interface CurrentUser {
  username: string;
  firstName: string;
  lastName: string;
  userId: string;
  permissions: Record<Resources, string>; // value: PermissionLevel.
  hasPermission(resource: Resources, level: PermissionLevels): boolean;
  isDeveloper(): boolean;
  currentFarmDefPath: string;
  allowedFarmDefPaths: string[];
}

export interface User {
  firstName: string;
  lastName: string;
  username: string;
}

// data read from back-end
export type CurrentUserData = Omit<CurrentUser, 'hasPermission' | 'isDeveloper'>;

export interface FarmOsModule {
  label: string;
  resource: string;
  url: string;
  permission_level: PermissionLevels;
}

export interface CoreState {
  currentUser?: CurrentUser;
  farmOsModules?: string[];
}
export interface CoreActions {
  setCurrentFarmDefPath: (path: string) => void;
}
