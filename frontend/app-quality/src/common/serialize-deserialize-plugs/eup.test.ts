import {
  EUPHRATES_PERCENTAGES,
  EUPHRATES_PLUGS,
  PLANT_DEFECTS,
  PLUG_DEFECTS,
  PROCESSING_DEFECTS,
} from '../../eup-quality-pages/seedling-qa-form-page/constants';

import { deserializeDataFromPlugs, serializePlugsFromValues } from '.';

import {
  MOCK_FORM_VALUES_EUPHRATES,
  MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES,
  MOCK_PLUGS_VALUE_EUPHRATES,
} from './test-helpers/eup-mocks';

describe('serializePlugsFromValues', () => {
  it('serializePlugsFromValues with Percentages correctly', () => {
    expect(
      serializePlugsFromValues({
        values: MOCK_FORM_VALUES_EUPHRATES,
        plugs: EUPHRATES_PLUGS,
        percentages: EUPHRATES_PERCENTAGES,
        plug_defects: PLUG_DEFECTS,
        processing_defects: PROCESSING_DEFECTS,
        plant_defects: PLANT_DEFECTS,
      })
    ).toEqual(MOCK_PLUGS_VALUE_EUPHRATES);
  });
});

describe('deserializeDataFromPlugs', () => {
  it('deserializeDataFromPlugs with Percentages correctly', () => {
    expect(
      deserializeDataFromPlugs({
        values: MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES,
        plugs: EUPHRATES_PLUGS,
        percentages: EUPHRATES_PERCENTAGES,
        plug_defects: PLUG_DEFECTS,
        processing_defects: PROCESSING_DEFECTS,
        plant_defects: PLANT_DEFECTS,
      })
    ).toEqual(expect.objectContaining(MOCK_FORM_VALUES_EUPHRATES));
  });
});
