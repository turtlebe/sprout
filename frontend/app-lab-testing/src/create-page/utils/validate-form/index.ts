import { allowDifferentSampleTypeCreation } from '@plentyag/app-lab-testing/src/common/utils/allow-different-sample-type-creation';
import { isFieldSameInAllItems } from '@plentyag/app-lab-testing/src/common/utils/is-field-same-in-all-items';
import { FormikErrors } from 'formik';

import { validateLabProvider, validateSampleType } from '../validate-field';

/**
 * This function performs form level validation - that is, validation across all rows.
 * This is needed for labTestProvider and sampleType fields since these fields must be the
 * same (in most cases) across all rows and we want to generate error if there are any diffs.
 */
export const validateForm = (
  values: LT.CreateSchema,
  labTestTypes: LT.LabTestType[]
): FormikErrors<LT.CreateSchema> => {
  const labTestProvider = values.items[0].labTestProvider;
  const areSampleTypeSame = allowDifferentSampleTypeCreation(labTestProvider, labTestTypes)
    ? true
    : isFieldSameInAllItems(field => field.sampleType, values.items);

  const areLabTestProviderSame = isFieldSameInAllItems(field => field.labTestProvider, values.items);

  const items = [];
  values.items.forEach((rowValue, index) => {
    const error: Partial<Record<keyof LT.CreateItem, string>> = {};

    const labTestProviderError = validateLabProvider(areLabTestProviderSame, rowValue.labTestProvider);
    if (labTestProviderError) {
      error.labTestProvider = labTestProviderError;
    }

    const sampleTypeError = validateSampleType(areSampleTypeSame, rowValue.sampleType);
    if (sampleTypeError) {
      error.sampleType = sampleTypeError;
    }

    if (labTestProviderError || sampleTypeError) {
      items[index] = error;
    }
  });

  // return empty object when there are no errors.
  return items.length > 0 ? { items } : {};
};
