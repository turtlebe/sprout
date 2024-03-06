type EventTypes = import('./interface-types').EventTypes;
type HealthStatus = import('./interface-types').HealthStatus;
type DumpRefillStatus = import('./interface-types').DumpRefillStatus;
// lab testing interfaces created during api calls to fetch lab test types and lab samples.

declare namespace LT {
  type LabTestName = string;
  type SampleTypeName = string;

  interface Schema {
    range: string; // range of acceptable type for example: '<100' or '<100, > 1' or 'Negative'
    units: string; // example: "25g"
  }

  // the combination of lab provider and kind uniquely identifies a particular test type.
  // each test type has a number of individual tests that will be performed on the sample - defined in schema.
  interface LabTestType {
    createdAt: string; // "2019-12-16T01:13:20Z"
    createdByUsername: string; // "drubio"
    labTestKind: string; // "water"
    labTestProvider: string; // "anresco"
    labTestName: LabTestName; // combo of kind and provider: "water-anresco"
    labTestTypeId: string; // "39c22de7-b0f8-4a6d-807f-dd2a11ebd71f"
    schemaResultsAndThreholdsBySampleType: Map<SampleTypeName, Map<LabTestName, Schema>>;
    schemaSubmissionFormBySampleType: Map<SampleTypeName, LabTestName[]>;
    updatedAt: string; // "2019-12-16T01:13:20Z"
    updatedByUsername: string; // "drubio"
    allowDifferentSampleTypeCreation: boolean; // for details see: https://plentyag.atlassian.net/browse/SD-10147
  }

  // an individual test - each sample will likley contain many tests to be performed.
  interface TestResult {
    isNA: boolean; // true if this test does not apply, value and passed fields will also have 'N/A' string.
    passed: boolean | string | null; // null --> no data yet. 'N/A' --> test does not apply
    value: string | null; // null --> no data yet.  'N/A' --> test does not apply, otherwise value from test result.
  }

  interface AdditionalProperties {
    labTestBlobId?: string;
    labTestSubmissionFormId?: string;
  }

  // lab test event - ex: sample created, sample updated, test data arrived from provided, etc.
  interface Event {
    type: EventTypes;
    createdAt: Date; // see SD-8848.
    username: string;
    additionalProperties: AdditionalProperties;
  }

  interface SampleResultInfo {
    farmDefId: string;
    farmDefPath: string;
    lotCodes: string[];
    notes: string;
    predictedHarvestDates: string[];
    productCodes: string[];
    sampleDate: string;
    sampleTime: string;
    sampleType: SampleTypeName;
    subLocation: string;
    labelDetails: string;
    trialIds: string[];
    treatmentIds: string[];
    materialLot: string;
    containerId: string;
    healthStatus: HealthStatus;
    harvestCycle?: number; // positive integer or not defined.
    providerSampleId: string;
    nutrientStage: string;
    dumpRefillStatus: DumpRefillStatus;
  }

  // data shown in the results page.
  interface SampleResult {
    labTestEvents: Event[];
    labTestKind: string;
    labTestPassed: boolean | null; // null --> not yet passed or failed.
    labTestProvider: string;
    labTestResults: Map<LabTestName, TestResult>;
    info: SampleResultInfo;
    labTestSampleId: string;
  }

  // data about download stored in S3 bucket.
  interface DownloadMetadata {
    uuid: string; // id identifying S3 bucket with data to download (e.g., cvs, pdf, etc).
    date: Date; // date id was created.
  }
}
