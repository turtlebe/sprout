import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';

jest.mock('@plentyag/brand-ui/src/components/feature-flag');
const mockUseFeatureFlag = useFeatureFlag as jest.Mock;

export const mockFeatureFlag = (featureName: string, featureValue: any) => {
  mockUseFeatureFlag.mockImplementation((inputName: string) => {
    return featureName === inputName ? featureValue : undefined;
  });
};
