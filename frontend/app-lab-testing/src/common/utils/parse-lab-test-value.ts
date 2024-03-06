export function parseLabTestResult(result: any): LT.TestResult {
  // backend return value of 'N/A' for tests that are not used in the given sample.
  return {
    isNA: result.value === 'N/A',
    passed: result.passed,
    value: result.value,
  };
}
