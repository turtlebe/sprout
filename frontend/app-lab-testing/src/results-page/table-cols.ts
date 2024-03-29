// columns shown in results view.
// all columns shown except for test result column which are dynamically generated (i.e., test columns)
export enum cols {
  'CREATED' = 'created',
  'SAMPLE_DATE' = 'sample_date',
  'SAMPLE_TIME' = 'sample_time',
  'SAMPLE_CREATOR' = 'sample_creator',
  'STATUS' = 'status',
  'SAMPLE_TYPE' = 'sample_type',
  'PRODUCT_CODES' = 'product_codes',
  'LOCATION' = 'location',
  'SUB_LOCATION' = 'sub_location',
  'TEST_TYPE' = 'test_type',
  'LAB' = 'lab',
  'LOT_CODES' = 'lot_codes',
  'HARVEST_DATES' = 'harvest_dates',
  'LABEL_DETAILS' = 'label_details',
  'NOTES' = 'notes',
  'LAB_TEST_SAMPLE_ID' = 'lab_test_sample_id',
  'TRIAL_IDS' = 'trial_id',
  'TREATMENT_IDS' = 'treatment_id',
  'HARVEST_CYCLE' = 'harvest_cycle',
  'HEALTH_STATUS' = 'health_status',
  'MATERIAL_LOT' = 'material_lot',
  'CONTAINER_ID' = 'container_id',
  'NUTRIENT_STAGE' = 'nutrient_stage',
  'DUMP_REFILL_STATUS' = 'dump_refill_status',
  'PROVIDER_SAMPLE_ID' = 'provider_sample_id',
  'ORIG_DATA' = 'orig_data', // hidden in table
}
