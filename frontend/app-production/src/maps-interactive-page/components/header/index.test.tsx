import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import {
  mockAreaWithGerminationLine,
  mockFarm,
  mockGerminationLine,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/farm-def-mocks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { HeaderToolbar } from '../header-toolbar';
import { NavToolbar } from '../nav-toolbar';

import { dataTestIdsHeader as dataTestIds, Header } from '.';

jest.mock('../header-toolbar');
jest.mock('../../hooks/use-query-parameter');
jest.mock('../nav-toolbar');
jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');

describe('Header', () => {
  const dataTestIdsHeaderToolbar = 'mock-header-toolbar';
  const dataTestIdsNavToolbar = 'mock-nav-toolbar';
  const mockInteractiveMapsHomeRoute = '/production/maps-interactive';

  beforeEach(() => {
    (useMapsInteractiveRouting as jest.Mock).mockReturnValue({
      getMapsInteractiveRoute: jest.fn().mockReturnValue(mockInteractiveMapsHomeRoute),
    });
    (HeaderToolbar as jest.Mock).mockReturnValue(<div data-testid={dataTestIdsHeaderToolbar}>mock header toolbar</div>);
    (NavToolbar as jest.Mock).mockReturnValue(<div data-testid={dataTestIdsNavToolbar}>mock navToolbar</div>);
  });

  function renderHeader(props: Header) {
    return render(<Header {...props} />, { wrapper: wrapperProps => <MemoryRouter {...wrapperProps} /> });
  }

  it('renders icon with link to interactive maps home page', () => {
    const { queryByTestId } = renderHeader({ farm: mockFarm });

    expect(queryByTestId(dataTestIds.icon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.icon)).toHaveAttribute('href', mockInteractiveMapsHomeRoute);
  });

  it('renders NavToolbar and HeaderToolbar', () => {
    const { queryByTestId } = renderHeader({
      farm: mockFarm,
      line: mockGerminationLine,
      area: mockAreaWithGerminationLine,
    });

    expect(queryByTestId(dataTestIdsNavToolbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeaderToolbar)).toBeInTheDocument();
  });

  it('does not render HeaderToolbar when area/line are not supported', () => {
    const { queryByTestId } = renderHeader({ farm: mockFarm });

    expect(queryByTestId(dataTestIdsHeaderToolbar)).not.toBeInTheDocument();
  });

  it('renders title as line name', () => {
    const { queryByTestId } = renderHeader({ farm: mockFarm, line: mockGerminationLine });

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(mockGerminationLine.displayName);
  });

  it('renders title with farm name if line not selected', () => {
    const { queryByTestId } = renderHeader({ farm: mockFarm });

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(`${mockFarm.displayName} Farm Interactive Maps`);
  });

  it('does not render title if farm and line not selected', () => {
    const { queryByTestId } = renderHeader({});

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('');
  });
});
