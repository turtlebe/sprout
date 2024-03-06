import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { LabelItem } from '@plentyag/core/src/types';
import { renderHook } from '@testing-library/react-hooks';

import { useGetLabels } from './use-get-labels';

mockGlobalSnackbar();

const mockLabels: LabelItem[] = [
  {
    description: 'Automatic Duplicate Barcode Detection',
    id: '2d015924-2a3d-4832-85ca-e44f8097b209',
    labelCategories: [
      {
        id: 'f0281c1f-53ba-4b3f-869b-1a59cfeae865',
        name: 'CONTAINER_OBSERVATION',
      },
    ],
    labelType: 'CONTAINER',
    name: 'Automatic Duplicate Barcode Detection',
    resourceTypes: ['TOWER'],
  },
  {
    id: 'bb97891b-33aa-4916-abbd-2438ea7f1d01',
    name: 'Dead Plants',
    description: 'Decomposed plant tissue (Stops at Harvester)',
    labelType: 'MATERIAL',
    resourceTypes: ['LOADED_TOWER'],
    labelCategories: [
      {
        id: 'dc0a85e9-88cb-4067-9408-001e5413cc3e',
        name: 'PLANT_HEALTH_STOPPED_AT_HARVESTER',
      },
    ],
  },
  {
    id: '245c571c-6767-42e8-a322-fe59ee313122',
    name: 'Tray Deep Clean Due',
    description: '(Stops at Transplanter)',
    labelType: 'CONTAINER',
    resourceTypes: ['TRAY'],
    labelCategories: [
      {
        id: 'c40b34ec-2ff3-4b4b-b144-01e9656c0042',
        name: 'CONTAINER_OBSERVATION_STOPPED_AT_TRANSPLANTER',
      },
    ],
  },
];
jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
mockUseSwrAxios.mockReturnValue({ data: mockLabels });

describe('useGetLabels', () => {
  it('returns material labels', () => {
    const { result } = renderHook(() => useGetLabels());

    expect(result.current.materialLabels).toEqual([mockLabels[1].name]);
  });

  it('returns container labels', () => {
    const { result } = renderHook(() => useGetLabels());

    expect(result.current.containerLabels).toEqual([mockLabels[0].name, mockLabels[2].name]);
  });

  it('returns container labels with matching containerType', () => {
    const { result } = renderHook(() => useGetLabels('TRAY'));

    expect(result.current.containerLabels).toEqual([mockLabels[2].name]);
  });

  it('shows snackbar error when there is a problem loading labels', () => {
    const error = 'ouch';
    mockUseSwrAxios.mockReturnValue({ data: undefined, error });

    renderHook(() => useGetLabels());

    expect(errorSnackbar).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining(error) }));
  });
});
