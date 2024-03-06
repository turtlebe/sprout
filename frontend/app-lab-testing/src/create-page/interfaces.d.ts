type FormikHelpers = import('formik').FormikHelpers;
type DateRangeValue = import('@plentyag/brand-ui/src/components/date-range-picker').DateRangeValue;
type HealthStatus = import('../common/types/interface-types').HealthStatus;
type DumpRefillStatus = import('../common/types/interface-types').DumpRefillStatus;

declare namespace LT {
  type SetFieldValueType = FormikHelpers<CreateItem>['setFieldValue'];

  type SetFormWarning = (fieldName: string, hasWarning: boolean) => void;

  type SelectOptions = SelectOption[];
  interface SelectOption {
    value: string;
    label: string;
  }

  // location in farm where sample was taken.
  interface Location {
    path?: string; // farm def path, undefined when empty (e.g., user clears field)
    id?: string; // farm def id, undefined when empty (e.g., user clears field)
    farmCode?: string; // not present for all farm def paths.
  }

  interface Test {
    name: string;
    selected: boolean;
  }

  // schema for formik.
  interface CreateSchema {
    items: CreateItem[];
  }

  // item in create page when submitting a sample to a lab provider.
  interface CreateItem {
    id: string;
    username: string;
    sampleDate: Date;
    sampleTime: Date;
    labTestKind: string;
    labTestProvider: string;
    sampleType: SampleTypeName;
    location: Location;
    subLocation: string;
    labelDetails: string;
    harvestDates?: DateRangeValue;
    productCodes: ProductCode[];
    lotCodes: string[];
    notes: string;
    trialIds: string; // comma separated list of integers
    treatmentIds: string; // comma separated list of integers
    harvestCycle: string; // number > 0
    healthStatus: HealthStatus;
    materialLot: string;
    containerId: string;
    tests: Test[];
    nutrientStage: string;
    dumpRefillStatus: DumpRefillStatus;
    providerSampleId: string;
  }

  // columns shown in create view.
  type CreateCols = keyof Omit<CreateItem, 'id' | 'username'>;
  // hide some columns in create view.
  interface HiddenColumns {
    [name: CreateCols]: boolean;
  }

  interface ProductCode {
    name: string; // product code, ex: "WHC"
    displayName: string; // ex: "Baby Kale"
  }
}
