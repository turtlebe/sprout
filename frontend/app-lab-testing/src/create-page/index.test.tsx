import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import { LocationDescriptor } from 'history';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useLabTestTypes } from '../common/hooks/use-lab-test-types';
import { mockLabTestTypes } from '../common/test-helpers/mock-lab-test-types';

import { CreatePage, dataTestIdsCreateView as dataTestIds } from './index';

import { RowComponentWrapper as MemoizedRowComponentWrapper } from './row-component-wrapper';

mockCurrentUser();

jest.mock('../common/hooks/use-lab-test-types');
const mockUseLabTestTypes = useLabTestTypes as jest.Mock;
mockUseLabTestTypes.mockReturnValue({
  isLoadingLabTestTypes: false,
  labTestTypes: mockLabTestTypes,
  labTestTypesLoadingError: '',
});

jest.mock('./row-component-wrapper');
// since component is memoized need to use "type" field to get mock
const mockMemoizedRowComponentWrapper = (MemoizedRowComponentWrapper as any).type as jest.Mock;
mockMemoizedRowComponentWrapper.mockImplementation(() => {
  return <div>mock row componenent wrapper</div>;
});

describe('CreatePage', () => {
  function renderCreateView(isEdit: boolean, selectedRows: LT.SampleResult[]) {
    const initialEntries: LocationDescriptor<LT.ReactRouterLocationState>[] = [
      { pathname: '/lab-testing/create', state: { isEdit, selectedRows } },
    ];
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <CreatePage />
      </MemoryRouter>
    );
  }

  it('shows edit title and hides "Add Row" button when editing lab test samples', () => {
    const { queryByTestId } = renderCreateView(true, []);
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Edit Lab Tests');
    expect(queryByTestId(dataTestIds.addRowButton)).not.toBeInTheDocument();
  });

  it('shows create title and "Add Row" button when creating new lab test samples', () => {
    const { queryByTestId } = renderCreateView(false, []);
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Create Lab Tests');
    expect(queryByTestId(dataTestIds.addRowButton)).toBeInTheDocument();
  });
});
