import { renderHook } from '@testing-library/react-hooks';

import { mockCrops } from '../../common/test-helpers';
import { GrowConfigurationType } from '../../common/types';

import { useAgGridConfig } from '.';

function hasColumnWithHeaderName(columnDefs: ColDef[], headerName: string) {
  return !!columnDefs.find(columnDef => columnDef.headerName === headerName);
}

describe('useAgGridConfig', () => {
  it('returns undefined when "crops" not provided', () => {
    const { result } = renderHook(() => useAgGridConfig(undefined));
    expect(result.current).toBeUndefined();
  });

  it('returns all columns - including dynamically generated farm columns', () => {
    const { result } = renderHook(() => useAgGridConfig(mockCrops));

    const agGridConfig = result.current;

    expect(agGridConfig.columnDefs).toHaveLength(13);

    // should have one: Tigris, other farms columns are remove since
    // there is no associated crop.
    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'Tigris')).toBe(true);

    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'LAX1')).toBe(false);
  });

  it('valueGetters return proper data', () => {
    const { result } = renderHook(() => useAgGridConfig(mockCrops));

    const agGridConfig = result.current;

    const data = mockCrops[0];
    const values = agGridConfig.columnDefs.map(columnDef => {
      const def = columnDef as ColDef;
      if (typeof def.valueGetter !== 'string') {
        return def.valueGetter({
          getValue: undefined,
          node: null,
          colDef: undefined,
          column: undefined,
          columnApi: undefined,
          api: undefined,
          context: undefined,
          data,
        });
      }
    });

    expect(values).toEqual([
      data.displayName,
      data.name,
      data.commonName,
      data.displayAbbreviation,
      GrowConfigurationType.isSeedableAlone,
      'Has crop',
      data.media,
      data.childCrops.map(c => c.defaultCropName),
      data.skus,
      data.cropTypeName,
      data.properties.trialDescription,
      data.cultivar,
      data.properties.scientificName,
    ]);
  });
});
