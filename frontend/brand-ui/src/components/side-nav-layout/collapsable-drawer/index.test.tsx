import { render } from '@testing-library/react';
import React from 'react';

import { CollapsableDrawer, dataTestIds, DEFAULT_COLLASPED_DRAWER_WIDTH, DEFAULT_DRAWER_WIDTH } from '.';

jest.mock('react-transition-group', () => {
  const FakeTransition = jest.fn(({ children, ...props }) => (props.in ? children('entered') : children('exited')));
  return { Transition: FakeTransition };
});

describe('CollapsableDrawer', () => {
  it('renders expanded when "open" is true', () => {
    const onToggle = jest.fn();
    const { queryByTestId } = render(
      <CollapsableDrawer open={true} onToggle={onToggle}>
        <p data-testid="content">content</p>
      </CollapsableDrawer>
    );

    expect(queryByTestId('content')).toBeInTheDocument();
    expect(queryByTestId('content')).toHaveTextContent('content');
    expect(queryByTestId(dataTestIds.drawer)).toHaveStyle('transform: none');

    queryByTestId(dataTestIds.toggle).click();
    expect(onToggle).toHaveBeenCalled();
  });

  it('renders collapsed when "open" is false', () => {
    const onToggle = jest.fn();
    const { queryByTestId } = render(
      <CollapsableDrawer open={false} onToggle={onToggle} drawerWidth={DEFAULT_DRAWER_WIDTH}>
        <p data-testid="content">content</p>
      </CollapsableDrawer>
    );

    expect(queryByTestId('content')).toBeInTheDocument();
    expect(queryByTestId('content')).toHaveTextContent('content');
    expect(queryByTestId(dataTestIds.drawer)).toHaveStyle(
      `transform: translateX(-${DEFAULT_DRAWER_WIDTH}) translateX(${DEFAULT_COLLASPED_DRAWER_WIDTH})`
    );

    queryByTestId(dataTestIds.toggle).click();
    expect(onToggle).toHaveBeenCalled();
  });

  it('renders collapsed when "open" is false using custom drawerWidth', () => {
    const drawerWidth = '200px';
    const { queryByTestId } = render(
      <CollapsableDrawer open={false} onToggle={jest.fn()} drawerWidth={drawerWidth}>
        <p data-testid="content">content</p>
      </CollapsableDrawer>
    );

    expect(queryByTestId(dataTestIds.drawer)).toHaveStyle(
      `transform: translateX(-${drawerWidth}) translateX(${DEFAULT_COLLASPED_DRAWER_WIDTH})`
    );
  });
});
