export const ERROR_REQUIRED = 'Required';
export const validateRequired = (value: string) => {
  return !value ? ERROR_REQUIRED : undefined;
};

export const validateFarmDef = (value: LT.Location) => {
  let error;
  if (!value.path) {
    error = ERROR_REQUIRED;
  } else if (!value.id) {
    error = 'Farm def id missing';
  }
  return error;
};

function checkLen(value: string, maxLength: number) {
  if (value.length > maxLength) {
    return `Length > ${maxLength} chars`;
  }
}

export const validateLabelDetails = (value: string) => {
  const maxLen = 60;
  return checkLen(value, maxLen);
};

export const validateSubLoc = (value: string) => {
  const maxLen = 30;
  return checkLen(value, maxLen);
};

export const validateNotes = (value: string) => {
  const maxLen = 350;
  return checkLen(value, maxLen);
};

export const LIST_OF_NUMBERS_ERROR = 'Input must be a comma separated list of integers > 0';
/**
 * Validates that given string is a comma separated list of positive integers.
 * @param value String to be validated.
 * @param maxValue Optional max integer value allowed.
 */
export const validateListOfNumbers = (value: string, maxValue?: number) => {
  const split = value.split(',');
  const isInvalid = split.some(item => {
    const trimmedItem = item.trim();
    return (
      trimmedItem && (!/^[0-9]+$/.test(trimmedItem) || Number(item) === 0 || (maxValue && Number(item) > maxValue))
    );
  });
  if (isInvalid) {
    const MAX_VALUE_ERROR = maxValue ? ` and < ${maxValue + 1}` : '';
    return `${LIST_OF_NUMBERS_ERROR}${MAX_VALUE_ERROR}`;
  }
};

export const validateTreatmentIds = (value: string) => {
  return validateListOfNumbers(value, 99);
};

export const TRIAL_REQ_WHEN_TREATMENT_DEFINED_ERROR = 'Required if Treatment has a value.';
export const validateTrialIds = (value: string, hasTreatmentIds: boolean) => {
  if (!value && hasTreatmentIds) {
    return TRIAL_REQ_WHEN_TREATMENT_DEFINED_ERROR;
  }
  return validateListOfNumbers(value, 10000000);
};

export const ERROR_LAB_PROVIDERS_NOT_ALL_SAME = 'All Lab Provider fields must be the same.';
export const validateLabProvider = (areLabTestProviderSame: boolean, value: string) => {
  // all lab providers must be the same - test to make
  if (!areLabTestProviderSame && value) {
    return 'All Lab Provider fields must be the same.';
  }

  return validateRequired(value);
};

export const ERROR_SAMPLE_TYPES_NOT_ALL_SAME = 'All Sample Type fields must be the same.';
export const validateSampleType = (areSampleTypeSame: boolean, value: string) => {
  // all lab providers must be the same - test to make
  if (!areSampleTypeSame && value) {
    return ERROR_SAMPLE_TYPES_NOT_ALL_SAME;
  }

  return validateRequired(value);
};

export const validateMaterialLot = (value: string) => {
  if (value && !/^((\S+-\S+-\S+-\S+)|(\S+\/\d{2}-\d{3}-\d{2}-\d{2}-\d{2}\/\S+))$/.test(value)) {
    // invalid
    return 'Ex: 1-SF-FIN-01 or 310-0000010A/20-027-13-25-45/TEST_LOT';
  }
};

export const validateContainerId = (value: string) => {
  if (
    value &&
    !/^([A-Za-z]+:\d+_\d+_\d+:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}(-d)?|P[-A-Z0-9]+:[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2})$/.test(
      value
    )
  ) {
    return 'Ex: P900-0008480B:A1B2-C3D4-E5 or Tray:0_0_1:A1B2-C3D4-E5-d';
  }
};

export const HARVEST_CYCLE_ERROR = 'Input must be integer > 0 and < 1000';
export const validateHarvestCycle = (value: string) => {
  if (value) {
    const intValue = /^(\d+)$/.test(value) ? Number(value) : -1;
    if (intValue <= 0 || intValue >= 1000) {
      return HARVEST_CYCLE_ERROR;
    }
  }
};
