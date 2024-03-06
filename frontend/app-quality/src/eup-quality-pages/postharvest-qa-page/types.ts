export interface DefaultValueType {
  required: boolean;
  hideFromTally?: boolean;
}

export interface FloatValueType extends DefaultValueType {
  min?: number;
  max?: number;
}

export interface FloatChoiceValueType extends DefaultValueType {
  min?: number;
  max?: number;
  choicethresholds?: Choicethresholds[];
}

export interface TextValueType extends DefaultValueType {
  minLength?: number;
  maxLength?: number;
}

export interface DateTimeValueType extends DefaultValueType {
  minDateTime?: string;
  maxDateTime?: string;
  format?: string;
}

export interface SingleChoiceValueType extends DefaultValueType {
  choices?: { name: string; label: string }[];
}

export enum ValueType {
  FLOAT = 'FLOAT',
  FLOAT_CHOICE = 'FLOAT_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TEXT = 'TEXT',
  DATE_TIME = 'DATE_TIME',
}

export interface DiscriminateValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  minDateTime?: number;
  maxDateTime?: number;
  equal?: any;
}

interface DiscriminateConfig {
  assessmentType: string;
  validation: DiscriminateValidation;
}

export interface LabelOverrideConfig {
  labels: Record<string, string>;
}

export interface TitleOverrideConfig {
  title: string;
}

export type OverrideConfig<T> = {
  discriminate: DiscriminateConfig;
} & T;

export interface Instructions {
  labelOverride?: OverrideConfig<LabelOverrideConfig>[];
  titleOverride?: OverrideConfig<TitleOverrideConfig>[];
  tooltip?: string;
}

export interface AssessmentType {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  label: string;
  name: string;
  uiOrder: number;
  valueType: ValueType;
  instructions?: Instructions;
}

export interface AssessmentTypeWithSingleChoiceValueType extends AssessmentType {
  valueType: ValueType.SINGLE_CHOICE;
  validation: SingleChoiceValueType;
}

export interface AssessmentTypeWithFloatValueType extends AssessmentType {
  valueType: ValueType.FLOAT;
  validation: FloatValueType;
}

export interface AssessmentTypeWithFloatChoiceValueType extends AssessmentType {
  valueType: ValueType.FLOAT_CHOICE;
  validation: FloatChoiceValueType;
}

export interface AssessmentTypeWithTextValueType extends AssessmentType {
  valueType: ValueType.TEXT;
  validation: TextValueType;
}

export interface AssessmentTypeWithDateTimeValueType extends AssessmentType {
  valueType: ValueType.DATE_TIME;
  validation: DateTimeValueType;
}

export type AssessmentTypes =
  | AssessmentTypeWithSingleChoiceValueType
  | AssessmentTypeWithFloatChoiceValueType
  | AssessmentTypeWithFloatValueType
  | AssessmentTypeWithTextValueType
  | AssessmentTypeWithDateTimeValueType;

export interface Assessment {
  name: string;
  value: string | number;
}

export interface PostharvestAuditSummaryRequest {
  limit?: number;
  offset?: number;
  site: string;
  farm: string;
  lot: string;
  sku: string;
}

export interface PostharvestAuditSummary {
  site: string;
  farm: string;
  lot: string;
  sku: string;
  totalAudits: number;
}

export interface PostharvestQaAudit {
  assessments: Assessment[];
  createdAt: string;
  createdBy: string;
  farm: string;
  id: string;
  lot: string;
  site: string;
  sku: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PostharvestQaLotSkuAssessmentValues {
  sku: string;
  value: any;
}
export interface PostharvestQaLotAssessment {
  label: string;
  name: string;
  valueType: ValueType;
  totalValue: any;
  skuValues?: PostharvestQaLotSkuAssessmentValues[];
}

export interface PostharvestQaLot {
  lot: string;
  skus: string[];
  total: number;
  isIngested?: boolean;
}

export interface PostharvestQaSku {
  id: string;
  lot: string;
  sku: string;
  total: number;
  isIngested?: boolean;
}

export interface EditPostharvestQaValues {
  originalModel: PostharvestQaAudit;
  lot: string;
  sku: string;
  [key: string]: any; // all other assessment types
}

export enum TallyType {
  PASS = 'PASS',
  FAIL = 'FAIL',
  REJECT = 'REJECT',
}

export interface AssessmentTally {
  name: string;
  values: {
    [key in TallyType]?: number;
  };
}

export interface TallyResults {
  assessmentTally: AssessmentTally[];
  firstAuditAt: string;
  lastAuditAt: string;
  totalAudits: number;
}

export interface PostharvestIngest {
  status: string;
  id: string;
  createdAt: string;
  createdBy: string;
  failureReason: string;
  updatedAt: string;
  updatedBy: string;
  site: string;
  farm: string;
  lot: string;
  netSuiteItem: string;
  path: string;
  observationsCreatedAt: string;
  observationsPublished: number;
  sku: string;
  tallyResults: TallyResults;
}

export interface PostharvestSkuTally {
  site: string;
  farm: string;
  lot: string;
  sku: string;
  tallyResults: TallyResults;
}

export interface PostharvestTally {
  site: string;
  farm: string;
  lot: string;
  skuTallies: {
    sku: string;
    tallyResults: TallyResults;
  }[];
  totalTally: TallyResults;
}

export interface DiscriminateSku {
  skukey: string;
  skuvalue: string;
  validation: DiscriminateValidation;
}

export interface Choicethresholds {
  discriminate: DiscriminateSku;
  value: TallyType;
}
