import { OverrideConfig } from '../../types';

export const getAssessmentTypeOverrideConfig = <T>(
  overrideConfigs: OverrideConfig<T>[],
  values: any
): OverrideConfig<T> => {
  return overrideConfigs.find(config => {
    const value = values[config.discriminate.assessmentType];
    const { validation } = config.discriminate;

    if (value) {
      const validations = [];

      if (validation.min) {
        validations.push(value >= validation.min);
      }
      if (validation.max) {
        validations.push(value <= validation.max);
      }
      if (validation.equal) {
        validations.push(value === validation.equal);
      }
      if (validation.minLength) {
        validations.push(value.length >= validation.minLength);
      }
      if (validation.maxLength) {
        validations.push(value.length <= validation.maxLength);
      }

      return validations.every(test => test);
    }
    return false;
  });
};
