import { render } from '@testing-library/react';

import { FeatureFlag, useFeatureFlag } from '.';

jest.mock('./hooks/use-feature-flag');

describe('FeatureFlag', () => {
  beforeEach(() => {
    (useFeatureFlag as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component if feature flag is set', () => {
    // ARRANGE
    (useFeatureFlag as jest.Mock).mockReturnValue(true);
    const Test = () => <div data-testid="test">Hi</div>;

    // ACT
    const { queryByTestId } = render(
      <FeatureFlag featureName="newfeature">
        <Test />
      </FeatureFlag>
    );

    // ASSERT
    expect(queryByTestId('test')).toBeInTheDocument();
  });

  it('should not render component if feature flag is not set', () => {
    // ARRANGE
    (useFeatureFlag as jest.Mock).mockReturnValue(false);
    const Test = () => <div data-testid="test">Hi</div>;

    // ACT
    const { queryByTestId } = render(
      <FeatureFlag featureName="newfeature">
        <Test />
      </FeatureFlag>
    );

    // ASSERT
    expect(queryByTestId('test')).not.toBeInTheDocument();
  });

  it('should render FaCC component passing custom values if feature flag is set with custom values', () => {
    // ARRANGE
    (useFeatureFlag as jest.Mock).mockReturnValue('one,two,three');
    const Test = ({ value }) => <div data-testid="test">{value}</div>;

    // ACT
    const { queryByTestId } = render(
      <FeatureFlag featureName="newfeature">{value => <Test value={value} />}</FeatureFlag>
    );

    // ASSERT
    expect(queryByTestId('test')).toBeInTheDocument();
    expect(queryByTestId('test')).toHaveTextContent('one,two,three');
  });

  it('should render normal component passing custom values if feature flag is set with custom values', () => {
    // ARRANGE
    (useFeatureFlag as jest.Mock).mockReturnValue('one,two,three');
    const Test = () => <div data-testid="test">Hi</div>;

    // ACT
    const { queryByTestId } = render(
      <FeatureFlag featureName="newfeature">
        <Test />
        <div>yup yup</div>
      </FeatureFlag>
    );

    // ASSERT
    expect(queryByTestId('test')).toBeInTheDocument();
  });
});
