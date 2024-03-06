import {
  mockMapsState,
  mockMapsStateWithLoadDataMaterialAttributes,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { renderHook } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';

import { DEFAULT_ALL_RECORD } from '../../constants';

import { useSliderDataFromMapsState } from '.';

describe('useSliderDataFromMapsState', () => {
  const selectedDate = DateTime.fromISO('2021-02-14T00:10:37.582Z');

  it('returns hash object record with today selected', () => {
    const { result } = renderHook(() =>
      useSliderDataFromMapsState(mockMapsStateWithLoadDataMaterialAttributes, selectedDate)
    );

    expect(result.current.marksRecord).toEqual({
      '1': {
        ageCohortDate: new Date('2021-02-13T00:10:36.582Z'),
        value: 1,
        label: 'Day 1',
        shortLabel: '1',
      },
      '2': {
        ageCohortDate: new Date('2021-02-12T00:10:36.582Z'),
        value: 2,
        label: 'Day 2',
        shortLabel: '2',
      },
      '3': {
        ageCohortDate: new Date('2021-02-11T00:10:36.582Z'),
        value: 3,
        label: 'Day 3',
        shortLabel: '3',
      },
      '-1': { value: -1, label: 'All', shortLabel: 'All', ageCohortDate: 'all' },
    });
    expect(result.current.value).toEqual(-1);
  });

  it('returns all the marks (without All choice) and only labels for first and last items', () => {
    const { result } = renderHook(() =>
      useSliderDataFromMapsState(mockMapsStateWithLoadDataMaterialAttributes, selectedDate)
    );

    expect(result.current.marks[0]).toEqual({ label: '1', value: 1 });
    expect(result.current.marks[1]).toEqual({ value: 2 });
    expect(result.current.marks[2]).toEqual({ label: '3', value: 3 });
  });

  it('returns all when selectedAgeCohortDate is all', () => {
    const { result } = renderHook(() =>
      useSliderDataFromMapsState(
        mockMapsStateWithLoadDataMaterialAttributes,
        selectedDate,
        DEFAULT_ALL_RECORD.ageCohortDate
      )
    );

    expect(result.current.value).toEqual(DEFAULT_ALL_RECORD.value);
  });

  it('returns the value for MUI Slider from the selectedAgeCohortDate', () => {
    const selectedAgeCohortDate = DateTime.fromISO('2021-02-11T00:00:00.000Z').toJSDate();

    const { result } = renderHook(() =>
      useSliderDataFromMapsState(mockMapsStateWithLoadDataMaterialAttributes, selectedDate, selectedAgeCohortDate)
    );

    expect(result.current.value).toEqual(3);
  });

  it('returns empty data with default if mapsState is undefined', () => {
    const { result } = renderHook(() => useSliderDataFromMapsState(null, selectedDate));

    expect(result.current.marks.length).toEqual(0);
    expect(result.current.marksRecord['-1']).toEqual(DEFAULT_ALL_RECORD);
    expect(result.current.value).toEqual(-1);
  });

  it('returns empty data with default if load data is missing', () => {
    const { result } = renderHook(() => useSliderDataFromMapsState(mockMapsState, selectedDate));

    expect(result.current.marks.length).toEqual(0);
    expect(result.current.marksRecord['-1']).toEqual(DEFAULT_ALL_RECORD);
    expect(result.current.value).toEqual(-1);
  });
});
