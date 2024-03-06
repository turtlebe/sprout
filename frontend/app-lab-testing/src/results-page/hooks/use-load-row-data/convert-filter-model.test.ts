import { getEndOfDayISOString, getStartOfDayISOString } from '@plentyag/core/src/utils';

import { cols } from '../../table-cols';

import { convertFilterModelIntoQueryParameters } from './convert-filter-model';

describe('convertFilterModelIntoQueryParameters()', () => {
  describe('text filter tests', () => {
    it('text filter - equals', () => {
      const filterModel: LT.FilterModel = {};
      const textFilter: LT.TextFilterModel = { filterType: 'text', type: 'equals', filter: 'hello-world' };
      filterModel[cols.LAB] = textFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ lab_test_provider: 'hello-world' });
    });

    it('text filter - contains', () => {
      const filterModel: LT.FilterModel = {};
      const textFilter: LT.TextFilterModel = { filterType: 'text', type: 'contains', filter: 'hello-world' };
      filterModel[cols.LAB] = textFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ lab_test_provider: 'hello-world' });
    });
  });

  describe('selection filer tests', () => {
    it('selection filter - single item selected', () => {
      const filterModel: LT.FilterModel = {};
      const selectionFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Item1', value: 'item1' }],
      };
      filterModel[cols.SAMPLE_TYPE] = selectionFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ sample_type: 'item1' });
    });

    it('selection filter - multiple items selected', () => {
      const filterModel: LT.FilterModel = {};
      const selectionFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [
          { name: 'Item1', value: 'item1' },
          { name: 'Item2', value: 'item2' },
        ],
      };
      filterModel[cols.TEST_TYPE] = selectionFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ lab_test_kind: 'item1,item2' });
    });

    it('selection filter - empty strubg value should be passed to backend', () => {
      const filterModel: LT.FilterModel = {};
      const selectionFilter: LT.SelectionFilterModel = {
        filterType: 'selection',
        selectedItems: [{ name: 'Item1', value: '' }],
      };
      filterModel[cols.TEST_TYPE] = selectionFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ lab_test_kind: '""' });
    });
  });

  describe('date filter tests', () => {
    it('date filter - greaterThanOrEqual', () => {
      const filterModel: LT.FilterModel = {};
      const dateFilter: LT.DateFilterModel = {
        filterType: 'date',
        dateFrom: '2020-06-01 00:00:00',
        dateTo: '',
        type: 'greaterThanOrEqual',
      };
      filterModel[cols.CREATED] = dateFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ start_time: getStartOfDayISOString(dateFilter.dateFrom) });
    });

    it('date filter - inRange', () => {
      const filterModel: LT.FilterModel = {};
      const dateFilter: LT.DateFilterModel = {
        filterType: 'date',
        dateFrom: '2020-06-01 00:00:00',
        dateTo: '2020-06-30 00:00:00',
        type: 'inRange',
      };
      filterModel[cols.CREATED] = dateFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({
        start_time: getStartOfDayISOString(dateFilter.dateFrom),
        end_time: getEndOfDayISOString(dateFilter.dateTo),
      });
    });

    it('date filter - equals', () => {
      const filterModel: LT.FilterModel = {};
      const dateFilter: LT.DateFilterModel = {
        filterType: 'date',
        dateFrom: '2020-06-01 00:00:00',
        dateTo: '',
        type: 'equals',
      };
      filterModel[cols.HARVEST_DATES] = dateFilter;
      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ predicted_harvest_date: '2020-06-01' });
    });
  });

  it('mix of text, date and selection fitlers', () => {
    const filterModel: LT.FilterModel = {};

    const dateFilter: LT.DateFilterModel = {
      filterType: 'date',
      dateFrom: '2020-06-01 00:00:00',
      dateTo: '',
      type: 'greaterThanOrEqual',
    };
    filterModel[cols.CREATED] = dateFilter;

    const selectionFilter: LT.SelectionFilterModel = {
      filterType: 'selection',
      selectedItems: [
        { name: 'Item1', value: 'item1' },
        { name: 'Item2', value: 'item2' },
      ],
    };
    filterModel[cols.TEST_TYPE] = selectionFilter;

    const textFilter: LT.TextFilterModel = { filterType: 'text', type: 'equals', filter: 'hello-world' };
    filterModel[cols.LAB] = textFilter;

    const queryParm = convertFilterModelIntoQueryParameters(filterModel);
    expect(queryParm).toEqual({
      start_time: getStartOfDayISOString(dateFilter.dateFrom),
      lab_test_kind: 'item1,item2',
      lab_test_provider: 'hello-world',
    });
  });

  it('filter model with no mapping should produce no query args', () => {
    const filterModel: LT.FilterModel = {};

    const dateFilter: LT.DateFilterModel = {
      filterType: 'date',
      dateFrom: '2020-06-01 00:00:00',
      dateTo: '',
      type: 'greaterThanOrEqual',
    };
    filterModel['no-existent-col'] = dateFilter;

    const queryParm = convertFilterModelIntoQueryParameters(filterModel);
    expect(queryParm).toEqual({});
  });

  it('filter model with one item that has no mapping should be ignored, others should be processed.', () => {
    const filterModel: LT.FilterModel = {};

    const dateFilter: LT.DateFilterModel = {
      filterType: 'date',
      dateFrom: '2020-06-01 00:00:00',
      dateTo: '',
      type: 'greaterThanOrEqual',
    };
    filterModel['no-existent-col'] = dateFilter;
    filterModel[cols.CREATED] = dateFilter;

    const queryParm = convertFilterModelIntoQueryParameters(filterModel);
    expect(queryParm).toEqual({ start_time: getStartOfDayISOString(dateFilter.dateFrom) });
  });

  describe('text filter for Location', () => {
    it('Location with slash should be transformed', () => {
      const filterModel: LT.FilterModel = {};

      const dateFilter: LT.TextFilterModel = {
        filterType: 'text',
        filter: 'SSF2/BMP',
        type: 'contains',
      };
      filterModel[cols.LOCATION] = dateFilter;

      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ farm_def_path: '*SSF2/*/BMP*' });
    });

    it('should remove leading and trailing slashes', () => {
      const filterModel: LT.FilterModel = {};

      const dateFilter: LT.TextFilterModel = {
        filterType: 'text',
        filter: '/SSF2/BMP/',
        type: 'contains',
      };
      filterModel[cols.LOCATION] = dateFilter;

      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ farm_def_path: '*SSF2/*/BMP*' });
    });

    it('should do no tranformation on string with no slashes in between words', () => {
      const filterModel: LT.FilterModel = {};

      const dateFilter: LT.TextFilterModel = {
        filterType: 'text',
        filter: '/SSF2',
        type: 'contains',
      };
      filterModel[cols.LOCATION] = dateFilter;

      const queryParm = convertFilterModelIntoQueryParameters(filterModel);
      expect(queryParm).toEqual({ farm_def_path: '/SSF2' });
    });
  });
});
