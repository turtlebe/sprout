export function getTests({
  labTypeData,
  labTestKind,
  labSampleType,
  labTestProvider,
}: {
  labTypeData: LT.LabTestType[];
  labTestKind: string;
  labSampleType: LT.SampleTypeName;
  labTestProvider: string;
}): LT.Test[] {
  const tests: LT.Test[] = [];
  const selectLabTypeItem = labTypeData?.find(
    data => data.labTestKind === labTestKind && data.labTestProvider === labTestProvider
  );
  if (selectLabTypeItem?.schemaSubmissionFormBySampleType.has(labSampleType)) {
    selectLabTypeItem.schemaSubmissionFormBySampleType.get(labSampleType)?.forEach(labTestName => {
      tests.push({
        name: labTestName,
        selected: true,
      });
    });
  }
  return tests;
}
