// adding enum here since they can not be used in definition file.
export enum EventTypes {
  'created' = 'created',
  'blob' = 'blob',
  'manual' = 'manual',
  'submission_form' = 'submission_form',
  'edi' = 'edi',
  'notes' = 'notes',
  'in_house_google_sheet' = 'in_house_google_sheet',
}

export enum HealthStatus {
  'Healthy' = 'Healthy',
  'Unhealthy' = 'Unhealthy',
  'Empty' = '',
}

export enum DumpRefillStatus {
  'pre' = 'pre',
  'post' = 'post',
  'Empty' = '',
  'Intermittent' = 'Intermittent',
  'n/a' = 'n/a',
}
