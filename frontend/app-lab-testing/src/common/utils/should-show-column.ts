import { cols as ResultCols } from '../../results-page/table-cols';
// common logic to determine if column should be shown, for columns in either create or results views.
// https://plentyag.atlassian.net/browse/SD-7660
export function shouldShowColumn(
  colName: LT.CreateCols | ResultCols,
  sampleTypes: LT.SampleTypeName[],
  labTestProvider: string
) {
  const sampleTypesLowerCase = sampleTypes.map(st => st.toLocaleLowerCase());
  switch (colName) {
    case 'materialLot':
    case ResultCols.MATERIAL_LOT:
      return sampleTypesLowerCase.some(st => st === 'seed' || st === 'soil');
    case 'containerId':
    case ResultCols.CONTAINER_ID:
      return sampleTypesLowerCase.some(st => st === 'swab' || st === 'product');
    case 'providerSampleId':
    case ResultCols.PROVIDER_SAMPLE_ID:
      return labTestProvider == 'Novacrop';
    default:
      return true;
  }
}
