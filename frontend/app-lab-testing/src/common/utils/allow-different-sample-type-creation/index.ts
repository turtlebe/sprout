// for details see: https://plentyag.atlassian.net/browse/SD-10147
// but sample types do not need to be the same if field "allowDifferentSampleTypeCreation"
// is true in matching lab test type.
export function allowDifferentSampleTypeCreation(labTestProvider: string, labTestTypes: LT.LabTestType[]) {
  const firstMatchingLabTestType = labTestTypes?.find(labTestType => labTestType.labTestProvider === labTestProvider);

  return firstMatchingLabTestType ? firstMatchingLabTestType.allowDifferentSampleTypeCreation : false;
}
