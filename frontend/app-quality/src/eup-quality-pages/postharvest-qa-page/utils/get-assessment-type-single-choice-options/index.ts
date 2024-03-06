import { AssessmentTypeWithSingleChoiceValueType, LabelOverrideConfig } from '../../types';
import { getAssessmentTypeOverrideConfig } from '../get-assessment-type-override-config';

export const getAssessmentTypeSingleChoiceOptions = (
  assessmentType: AssessmentTypeWithSingleChoiceValueType,
  values: any
): FormGen.RadioOption[] => {
  const { choices } = assessmentType.validation;

  if (!choices) {
    return [];
  }

  // label override
  if (assessmentType?.instructions?.labelOverride) {
    // suss out
    const labelOverrideConfig = getAssessmentTypeOverrideConfig<LabelOverrideConfig>(
      assessmentType.instructions.labelOverride,
      values
    );

    // overriden labels and if there is no found override config then default to original label
    return choices.map(choice => ({
      value: choice.name,
      label: labelOverrideConfig ? labelOverrideConfig.labels[choice.name] : choice.label,
    }));
  }

  // default
  return choices.map(choice => ({
    value: choice.name,
    label: choice.label,
  }));
};
