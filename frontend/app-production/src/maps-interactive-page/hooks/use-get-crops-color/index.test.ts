import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { renderHook } from '@testing-library/react-hooks';

import { useGetCropsColor } from '.';

import { defaultColorMap, distinctColors } from './utils';

const mockCrops = [{ name: 'CRC' }, { name: 'B11' }];

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useGetCropsColor', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockReturnValue({
      isValidating: false,
      data: mockCrops,
    });
  });

  it('generates color map for mock farm def crops', () => {
    const { result } = renderHook(() => useGetCropsColor());

    const getCropColor = result.current.getCropColor;

    // crops get alphabetically sorted, so order of picked colors should same.
    expect(getCropColor('B11')).toEqual(distinctColors[0]);
    expect(getCropColor('CRC')).toEqual(defaultColorMap['CRC']);
  });

  it('has fixed colors for some crops', () => {
    const mockCrops = Object.keys(defaultColorMap).map(cropName => ({ name: cropName }));

    mockUseSwrAxios.mockReturnValue({
      isValidating: false,
      data: mockCrops,
    });

    const { result } = renderHook(() => useGetCropsColor());

    const getCropColor = result.current.getCropColor;

    Object.keys(defaultColorMap).forEach(cropName => expect(getCropColor(cropName)).toEqual(defaultColorMap[cropName]));
  });

  it('generates fallback colors', () => {
    const { result } = renderHook(() => useGetCropsColor());

    const getCropColor = result.current.getCropColor;

    const unusedColors = distinctColors.slice(mockCrops.length);

    // generate a bunch of random crop names and ensure they all fall into the unused list.
    for (var i = 0; i < 1000; i++) {
      const randomCropName = (Math.random() + 1).toString(36).substring(7);
      expect(unusedColors.includes(getCropColor(randomCropName))).toBe(true);
    }
  });
});
