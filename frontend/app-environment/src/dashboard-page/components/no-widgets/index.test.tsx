import { render } from '@testing-library/react';
import React from 'react';

import { ButtonCreateWidget } from '../button-create-widget';

import { dataTestIdsNoWidgets as dataTestIds, NoWidgets } from '.';

jest.mock('../button-create-widget');

const dashboardId = 'dashboardId';
const onWidgetCreated = jest.fn();
const MockButtonCreateWidget = ButtonCreateWidget as jest.Mock;

describe('NoWidgets', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    MockButtonCreateWidget.mockImplementation(() => <div />);
  });

  it('renders nothing', () => {
    const { queryByTestId } = render(
      <NoWidgets isLoading={true} widgets={[]} dashboardId={dashboardId} onWidgetCreated={onWidgetCreated} />
    );

    expect(queryByTestId(dataTestIds.info)).not.toBeInTheDocument();
  });

  it('renders a placeholder when no widgets exists', () => {
    const { queryByTestId } = render(
      <NoWidgets isLoading={false} widgets={[]} dashboardId={dashboardId} onWidgetCreated={onWidgetCreated} />
    );

    expect(queryByTestId(dataTestIds.info)).toBeInTheDocument();
  });
});
