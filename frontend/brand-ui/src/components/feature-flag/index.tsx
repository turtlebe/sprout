import React from 'react';

import { Show } from '../show';

import { useFeatureFlag } from './hooks/use-feature-flag';

export { useFeatureFlag };

const dataTestIds = {};

export { dataTestIds as dataTestIdsFeatureFlag };

type FaCC = (featureValue?: string) => React.ReactNode | React.ReactNodeArray;

export interface FeatureFlag {
  featureName: string;
  fallback?: JSX.Element;
  children: React.ReactNode | React.ReactNodeArray | FaCC;
}

export const FeatureFlag: React.FC<FeatureFlag> = props => {
  const { children, featureName, fallback } = props;
  const featureValue = useFeatureFlag(featureName);

  // Detect if the children is a ReactNode/Array then render child, otherwise test if it is a FaCC then execute and render
  const renderChildren =
    React.Children.count(children) > 0 ? children : typeof children === 'function' ? children(featureValue) : undefined;

  return (
    <Show fallback={fallback} when={Boolean(featureValue)}>
      {renderChildren}
    </Show>
  );
};
