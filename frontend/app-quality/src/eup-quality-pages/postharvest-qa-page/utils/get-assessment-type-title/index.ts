import { AssessmentType, TitleOverrideConfig } from '../../types';
import { getAssessmentTypeOverrideConfig } from '../get-assessment-type-override-config';
import { replaceTokens } from '../replace-tokens';

export const getAssessmentTypeTitle = (assessmentType: AssessmentType, values: any = {}): string => {
  const { label } = assessmentType;

  // title override
  if (assessmentType?.instructions?.titleOverride) {
    // suss out
    const titleOverrideConfig = getAssessmentTypeOverrideConfig<TitleOverrideConfig>(
      assessmentType.instructions.titleOverride,
      values
    );

    // override labels
    if (titleOverrideConfig) {
      const newTitle = titleOverrideConfig ? titleOverrideConfig.title : label;

      // replae labels with tokens
      return replaceTokens(newTitle, tokenKey => values[tokenKey]);
    }
  }

  // default
  return label;
};
