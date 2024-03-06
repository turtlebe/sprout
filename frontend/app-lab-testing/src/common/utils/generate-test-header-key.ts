// from test results generate unique combination of: provide, sample type, and test type (aka, kind).
// then use this to generate headers that should appear.
// ag-grid doesn't allow dot in header field, replace with underscore.
export function generateTestHeaderKey({
  provider,
  kind,
  sampleType,
  testName,
}: {
  provider: string;
  kind: string;
  sampleType: string;
  testName: string;
}) {
  return provider + '_' + kind + '_' + sampleType + '_' + testName.replace(/\./gi, '_');
}
