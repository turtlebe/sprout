import { cols } from '../../table-cols';

// some columns such as date have start and end
// others have only single value.
interface ColMap {
  start: string;
  end?: string;
  // provides custom formatter for given column.
  filterFormatter?: (filter: string) => string;
}

function locationFilterFormatter(filter: string) {
  // for location if user types: "SSF2/BMP" then we need to convert into "*SSF2/*/BMP*"
  // since backend uses full farm def path for search query: "sites/SSF2/areas/BMP",
  // just sending "SSF/BMP" will yield no results.
  // so any slashes are replaced with "/*/" and * added to front and end.

  // remove leading and trailing slashes
  const filterWithoutLeadingAndTrailingSlashes = filter.replace(/^\/|\/$/g, '');
  if (filterWithoutLeadingAndTrailingSlashes.includes('/')) {
    // replace remaining slashes with: /*/
    return '*' + filterWithoutLeadingAndTrailingSlashes.replace(/\//g, '/*/') + '*';
  } else {
    return filter;
  }
}

// maps column name to backend query parameter(s) name.
export const colsToQueryParam = new Map<string, ColMap>([
  [cols.CREATED, { start: 'start_time', end: 'end_time' }],
  [cols.SAMPLE_DATE, { start: 'sample_date_start', end: 'sample_date_end' }],
  [cols.SAMPLE_CREATOR, { start: 'created_by_username' }],
  [cols.STATUS, { start: 'lab_test_passed' }],
  [cols.SAMPLE_TYPE, { start: 'sample_type' }],
  [cols.PRODUCT_CODES, { start: 'product_code' }],
  [cols.LOCATION, { start: 'farm_def_path', filterFormatter: locationFilterFormatter }],
  [cols.SUB_LOCATION, { start: 'sub_location' }],
  [cols.TEST_TYPE, { start: 'lab_test_kind' }],
  [cols.LAB, { start: 'lab_test_provider' }],
  [cols.LOT_CODES, { start: 'lot_code' }],
  [cols.HARVEST_DATES, { start: 'predicted_harvest_date' }],
  [cols.LABEL_DETAILS, { start: 'label_details' }],
  [cols.NOTES, { start: 'notes' }],
  [cols.LAB_TEST_SAMPLE_ID, { start: 'lab_test_sample_id' }],
  [cols.TRIAL_IDS, { start: 'trial_id' }],
  [cols.TREATMENT_IDS, { start: 'treatment_id' }],
  [cols.HARVEST_CYCLE, { start: 'harvest_cycle' }],
  [cols.HEALTH_STATUS, { start: 'health_status' }],
  [cols.MATERIAL_LOT, { start: 'material_lot' }],
  [cols.CONTAINER_ID, { start: 'container_id' }],
  [cols.NUTRIENT_STAGE, { start: 'nutrient_stage' }],
  [cols.DUMP_REFILL_STATUS, { start: 'dump_refill_status' }],
  [cols.PROVIDER_SAMPLE_ID, { start: 'provider_sample_id' }],
]);
