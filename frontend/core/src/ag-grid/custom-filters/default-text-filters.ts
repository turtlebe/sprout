export const defaultAgTextEqualsColumnFilter = {
  filter: 'agTextColumnFilter',
  filterParams: {
    suppressAndOrCondition: true,
    filterOptions: ['equals'],
  },
};

export const defaultAgTextContainsColumnFilter = {
  filter: 'agTextColumnFilter',
  filterParams: {
    suppressAndOrCondition: true,
    filterOptions: ['contains'],
  },
};

export const buildAgTextColumnFilter = (
  defaultFilterOption: 'equals' | 'contains' = 'equals',
  filterOptions = ['equals', 'contains'],
  textMatcher = undefined
) => ({
  filter: 'agTextColumnFilter',
  filterParams: {
    suppressAndOrCondition: true,
    filterOptions,
    defaultOption: defaultFilterOption,
    textMatcher,
  },
});

export const defaultAgTextContainsOrBlankFilter = {
  filter: 'agTextColumnFilter',
  filterParams: {
    suppressAndOrCondition: true,
    filterOptions: [
      'contains',
      {
        displayKey: 'blank',
        displayName: 'Blank Values',
        test: (filterValue, cellValue) => cellValue === null || cellValue === undefined || cellValue === '',
        hideFilterInput: true,
      },
    ],
  },
};
