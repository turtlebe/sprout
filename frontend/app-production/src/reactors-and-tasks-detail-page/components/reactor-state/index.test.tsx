import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { useGetState } from '../../hooks';
import { mockReactorStateReturnValue } from '../../test-helpers';

jest.mock('../../hooks/use-get-state');
const mockUseGetState = useGetState as jest.Mock;

import { dataTestIdsReactorState as dataTestIds, ReactorState } from '.';

describe('ReactorState', () => {
  function renderReactorState(reactorPath?: string) {
    return render(<ReactorState reactorPath={reactorPath} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('shows json view of reactor state', () => {
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: mockReactorStateReturnValue,
    });
    const { queryByTestId } = renderReactorState('sites/SSF2');

    expect(queryByTestId(dataTestIds.jsonView)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noReactorPath)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noState)).not.toBeInTheDocument();
  });

  it('shows message when loaded reactor has no state information', () => {
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: null,
    });
    const { queryByTestId } = renderReactorState('sites/SSF2');

    expect(queryByTestId(dataTestIds.jsonView)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noReactorPath)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noState)).toBeInTheDocument();
  });

  it('shows message when no reactor path is provided', () => {
    mockUseGetState.mockReturnValue({
      isLoading: false,
      error: undefined,
      data: null,
    });
    const { queryByTestId } = renderReactorState();

    expect(queryByTestId(dataTestIds.jsonView)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noReactorPath)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noState)).not.toBeInTheDocument();
  });
});
