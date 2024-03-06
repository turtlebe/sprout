import { renderHook } from '@testing-library/react-hooks';
import { useLocalStorage } from 'react-use';

import { useFeatureFlag } from './use-feature-flag';

jest.mock('react-use');

describe('useFeatureFlag', () => {
  let currentLocation;

  // Save previous implementation
  beforeAll(() => {
    currentLocation = window.location;
  });

  // Rstore previous implementation
  afterAll(() => {
    window.location = currentLocation;
  });

  beforeEach(() => {
    delete window.location;
    window.location = { ...currentLocation };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function buildMockLocalStorage(mockFeatureValue) {
    const mockSetFeatureValue = jest.fn();
    const mockRemoveFeature = jest.fn();

    // feature toggle
    (useLocalStorage as jest.Mock).mockReturnValueOnce([mockFeatureValue, mockSetFeatureValue, mockRemoveFeature]);

    return {
      mockSetFeatureValue,
      mockRemoveFeature,
    };
  }

  it('should set feature flag if query params is set to "true"', () => {
    // ARRANGE
    // -- mock uselocalstorage
    const { mockSetFeatureValue } = buildMockLocalStorage(undefined);
    // -- stub query params
    window.location = { ...currentLocation, search: '?feature:test=true' };

    // ACT
    renderHook(() => useFeatureFlag('test'));

    // ASSERT
    expect(mockSetFeatureValue).toHaveBeenCalledWith('true');
  });

  it('should be able to set custom values', () => {
    // ARRANGE
    // -- mock uselocalstorage
    const { mockSetFeatureValue } = buildMockLocalStorage(undefined);
    // -- stub query params
    window.location = { ...currentLocation, search: '?feature:test=one,two,three' };

    // ACT
    renderHook(() => useFeatureFlag('test'));

    // ASSERT
    expect(mockSetFeatureValue).toHaveBeenCalledWith('one,two,three');
  });

  it('should set new custom values if query params custom values changed when feature toggle already on', () => {
    // ARRANGE
    // -- mock uselocalstorage
    const { mockSetFeatureValue } = buildMockLocalStorage('one,two,three');
    // -- stub query params
    window.location = { ...currentLocation, search: '?feature:test=one' };

    // ACT
    renderHook(() => useFeatureFlag('test'));

    // ASSERT
    expect(mockSetFeatureValue).toHaveBeenCalledWith('one');
  });

  it('should remove feature flag if remove feature key is used with any value', () => {
    // ARRANGE
    // -- mock uselocalstorage
    const { mockRemoveFeature } = buildMockLocalStorage('one,two,three');

    // -- stub query params
    window.location = { ...currentLocation, search: '?removeFeature=test' };

    // ACT
    renderHook(() => useFeatureFlag('test'));

    // ASSERT
    expect(mockRemoveFeature).toHaveBeenCalled();
  });
});
