import { useLocalStorage } from 'react-use';

const PREFIX = 'feature:';
const REMOVE_KEY = 'removeFeature';

export type UseFeatureFlagReturn = any;

export const useFeatureFlag = (featureName: string): UseFeatureFlagReturn => {
  // Key
  const key = `${PREFIX}${featureName}`;
  const removeKey = REMOVE_KEY;

  // Check local storage if flag is set
  const [featureValue, setFeatureValue, removeFeature] = useLocalStorage<any>(key);

  // Check Query Params
  const { location } = window;
  const searchParam = new URLSearchParams(location.search);
  const searchParamFeatureValue = searchParam.get(key);
  const searchParamRemoveFeatureName = searchParam.get(removeKey);

  // If feature flag has previously been set...
  if (featureValue) {
    // removing the feature
    if (searchParamRemoveFeatureName === featureName) {
      removeFeature();

      // overriding existing values if there new values found in query
    } else if (Boolean(searchParamFeatureValue) && searchParamFeatureValue !== featureValue) {
      setFeatureValue(searchParamFeatureValue);
    }

    // otherwise, if feature flag was never set before...
  } else {
    // if there's a value set it
    if (Boolean(searchParamFeatureValue)) {
      setFeatureValue(searchParamFeatureValue);
    }
  }

  return featureValue;
};
