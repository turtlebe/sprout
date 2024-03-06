import { dataTestIdsDialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';

import { getTooltipComponent } from '.';

describe('getTooltipComponent', () => {
  it('renders tooltip with title and description', () => {
    // ARRANGE
    const mockProps = {
      open: true,
      title: undefined,
      onClose: jest.fn(),
      formGenField: null,
      formikProps: null,
    };

    // ACT
    const component = getTooltipComponent('title', 'description')(mockProps);
    const { queryByTestId } = render(component);

    // ASSERT
    expect(queryByTestId(dataTestIdsDialogFormGenTooltip.title)).toHaveTextContent('title');
    expect(queryByTestId(dataTestIdsDialogFormGenTooltip.content)).toHaveTextContent('description');
  });
});
