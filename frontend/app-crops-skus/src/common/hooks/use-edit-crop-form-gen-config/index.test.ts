import { HasFarm } from '@plentyag/app-crops-skus/src/common/types';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';

import { mockCrops, mockCropTypes } from '../../test-helpers';
import { GrowConfigurationType } from '../../types';
import { useSearchCropTypes } from '../use-search-crop-types';

import { useEditCropFormGenConfig } from '.';

import { EditCropFormikValues } from './types';

jest.mock('../use-search-crop-types');
const mockUseSearchCropTypes = useSearchCropTypes as jest.Mock;
mockUseSearchCropTypes.mockReturnValue({
  isLoading: false,
  cropTypes: mockCropTypes,
});

const mockCrop = cloneDeep(mockCrops[1]);
mockCrop.properties = {
  plannedGrowDays: 5, // add existing field to make sure merges into what is sent to backend.
};
const mockFormValues: EditCropFormikValues = {
  ...mockCrop,
  farms: ['sites/LAX1/farms/LAX1'],
  trialDescription: 'the trial description',
  growConfiguration: GrowConfigurationType.isBlendedAtSeedingMachine,
  scientificName: undefined,
};

const minNumberChildCrops = 2;

describe('useEditCropFormGenConfig', () => {
  function expectSerializeResultToMatch(serializeResult: any, hasFarm: HasFarm) {
    expect(serializeResult).toEqual({
      name: mockFormValues.name,
      commonName: mockFormValues.commonName,
      displayAbbreviation: mockFormValues.name,
      isSeedable: true,
      childCrops: mockFormValues.childCrops,
      cropTypeName: mockFormValues.cropTypeName,
      media: mockFormValues.media,
      cultivar: mockFormValues.cultivar,
      properties: {
        plannedGrowDays: mockCrop.properties.plannedGrowDays,
        scientificName: undefined,
        trialDescription: mockFormValues.trialDescription,
      },
      hasFarm,
    });
  }

  it('returns undefined when crop not provided', () => {
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: undefined,
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    expect(result.current).toBeUndefined();
  });

  it('serializes the form data', () => {
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: cloneDeep(mockCrop),
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const serializeResult = result.current.serialize(mockFormValues);

    expectSerializeResultToMatch(serializeResult, {
      'sites/LAX1/farms/LAX1': true,
      'sites/SSF2/farms/Tigris': false,
    });
  });

  it('serialize the form data properly when media value of "none" is selected.', () => {
    const mockCropWithoutMedia = cloneDeep(mockCrop);
    delete mockCropWithoutMedia.media;
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: mockCropWithoutMedia,
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const mockFormValuesWithNoneMedia = cloneDeep(mockFormValues);
    mockFormValuesWithNoneMedia.media = 'none';
    const serializeResult = result.current.serialize(mockFormValues);

    expectSerializeResultToMatch(serializeResult, {
      'sites/LAX1/farms/LAX1': true,
      'sites/SSF2/farms/Tigris': false,
    });
  });

  it('does not send "hasFarm" in edit mode when nothing has changed', () => {
    const _mockCrop = cloneDeep(mockCrop);
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: _mockCrop,
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const mockFormValuesWithChangedFarm = cloneDeep(mockFormValues);
    mockFormValuesWithChangedFarm.farms = ['sites/SSF2/farms/Tigris'];

    const serializeResult = result.current.serialize(mockFormValuesWithChangedFarm);

    expectSerializeResultToMatch(serializeResult, undefined);
  });

  it('trial description validate returns proper value', () => {
    const _mockCrop = cloneDeep(mockCrop);
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: _mockCrop,
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const trialDescription = result.current.fields.find(
      field => field['name'] === 'trialDescription'
    ) as FormGen.FieldTextField;

    expect(trialDescription.validate.isValidSync('')).toBe(true);
    expect(trialDescription.validate.isValidSync('aaa')).toBe(true);
    expect(trialDescription.validate.isValidSync(Array(75).fill('a').join(''))).toBe(true);
    expect(trialDescription.validate.isValidSync(Array(76).fill('a').join(''))).toBe(false);
  });

  it('does not show "Component Crops" form-gen fields when there are no farms associated the edited crop', () => {
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: cloneDeep(mockCrop),
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const componentCropsFields = result.current.fields[result.current.fields.length - 1] as FormGen.FieldComputed;
    const computedFields = componentCropsFields.computed({
      farms: ['sites/LAX1/farms/LAX1'],
    });
    expect(computedFields).toHaveLength(0);
  });

  it('shows "Component Crops" form-gen fields when there are farms associated with edited crop', () => {
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: cloneDeep(mockCrops[1]),
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const componentCropsFields = result.current.fields[result.current.fields.length - 1] as FormGen.FieldComputed;
    const computedFields = componentCropsFields.computed({
      farms: ['sites/SSF2/farms/Tigris'],
      growConfiguration: GrowConfigurationType.isBlendedAtBlendingMachine,
    });
    expect(computedFields).toHaveLength(2);
  });

  it('does not show "Component Crops" form-gen fields when grow configuration is not "isBlendedAtBlendingMachine"', () => {
    const { result } = renderHook(() =>
      useEditCropFormGenConfig({
        cropToEdit: cloneDeep(mockCrops[1]),
        crops: mockCrops,
        isUpdating: true,
        minNumberChildCrops,
      })
    );

    const componentCropsFields = result.current.fields[result.current.fields.length - 1] as FormGen.FieldComputed;
    const computedFields = componentCropsFields.computed({
      farms: ['sites/SSF2/farms/Tigris'],
      growConfiguration: GrowConfigurationType.isBlendedAtSeedingMachine,
    });
    expect(computedFields).toHaveLength(0);
  });
});
