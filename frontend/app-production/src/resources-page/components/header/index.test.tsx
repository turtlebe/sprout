import { act, fireEvent, render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { ActionsForm } from '../../../actions-form-page/components';
import { useSearch } from '../../hooks/use-search';
import { mockResult, mockResultContainerOnly, mockResultMaterialOnly } from '../search/mock-search-result';

import { dataTestIds, Header } from './index';

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

const mockOperation: ProdActions.Operation = {
  path: 'sites/SSF2/interfaces/TigrisSite/methods/Trash',
  prefilledArgs: undefined, // not needed for testing
};
jest.mock('../../../common/components/operations', () => {
  const fakeOperations = jest.fn(props => {
    function handleFakeOperationSelect() {
      props.selectOperation(mockOperation);
    }
    return (
      <div>
        <button onClick={handleFakeOperationSelect} data-testid="fake-ops-button">
          fake operation button
        </button>
      </div>
    );
  });
  return { Operations: fakeOperations };
});
jest.mock('../../../common/components/edit-resource', () => {
  const fakeEditResource = jest.fn(props => {
    return (
      <div data-testid="mock-edit-resource">
        <button onClick={props.onClose} data-testid="fake-close-button">
          fake edit resrouce button
        </button>
      </div>
    );
  });
  return { EditResource: fakeEditResource };
});

jest.mock('../labels', () => {
  const fakeLabels = jest.fn(() => <div></div>);
  return { Labels: fakeLabels };
});

jest.mock('../../../actions-form-page/components');
const mockActionsForm = ActionsForm as jest.Mock;

describe('Header', () => {
  beforeEach(() => {
    mockActionsForm.mockImplementation(props => {
      return <div data-testid="fake-action-form">{props.operation.path}</div>;
    });
  });

  function renderHeader(mockSearchResult: ProdResources.ResourceState, onCommentClick?: Header['onCommentClick']) {
    const mockDoRefresh = jest.fn();
    mockUseSearch.mockReturnValue([mockSearchResult, { refreshSearch: mockDoRefresh }]);
    const { queryByTestId } = render(<Header onCommentClick={onCommentClick} />);
    return { queryByTestId, mockDoRefresh };
  }

  it('renders nothing if search result not provided', () => {
    const { queryByTestId } = renderHeader(undefined);
    expect(queryByTestId(dataTestIds.header)).toBe(null);
  });

  describe('title renders correctly', () => {
    it('shows edit resource buttons', () => {
      const { queryByTestId } = renderHeader(mockResultContainerOnly);
      expect(queryByTestId('mock-edit-resource')).toBeInTheDocument();
    });

    it('shows container type when resource has only container', () => {
      const { queryByTestId } = renderHeader(mockResultContainerOnly);
      expect(queryByTestId(dataTestIds.title)).toHaveTextContent('TOWER');
    });

    it('shows product type when resource has only material', () => {
      const { queryByTestId } = renderHeader(mockResultMaterialOnly);
      expect(queryByTestId(dataTestIds.title)).toHaveTextContent('B20');
    });

    it('shows material type when product type not provided for resource having only material', () => {
      const mockResultMaterialOnlyWithoutProduct = cloneDeep(mockResultMaterialOnly);
      mockResultMaterialOnlyWithoutProduct.materialObj.product = '';
      const { queryByTestId } = renderHeader(mockResultMaterialOnlyWithoutProduct);
      expect(queryByTestId(dataTestIds.title)).toHaveTextContent('LOADED_TOWER');
    });

    it('shows material and container info when resource has both', () => {
      const { queryByTestId } = renderHeader(mockResult);
      expect(queryByTestId(dataTestIds.title)).toHaveTextContent('TOWER with B20');
      expect(queryByTestId(dataTestIds.commentIcon)).not.toBeInTheDocument();
    });

    it('shows a clickable comment icon', () => {
      const onClickComment = jest.fn();
      const { queryByTestId } = renderHeader(mockResult, onClickComment);
      expect(queryByTestId(dataTestIds.title)).toHaveTextContent('TOWER with B20');
      expect(queryByTestId(dataTestIds.commentIcon)).toBeInTheDocument();
      expect(onClickComment).toHaveBeenCalledTimes(0);
      queryByTestId(dataTestIds.commentIcon).click();
      expect(onClickComment).toHaveBeenCalledTimes(1);
    });
  });

  it('displays operation in transform form', () => {
    const { queryByTestId } = renderHeader(mockResult);
    const fakeButton = queryByTestId('fake-ops-button');

    act(() => fakeButton.click());

    const fakeActionForm = queryByTestId('fake-action-form');
    expect(fakeActionForm).toBeTruthy();
    expect(fakeActionForm).toHaveTextContent(mockOperation.path);
  });

  it('removes operation and refreshes state when action form is closed', () => {
    const { queryByTestId, mockDoRefresh } = renderHeader(mockResult);
    const fakeButton = queryByTestId('fake-ops-button');

    act(() => fakeButton.click());

    expect(mockDoRefresh).not.toHaveBeenCalledWith();

    // form should now be open.
    expect(queryByTestId('fake-action-form')).toBeTruthy();

    // close action form by hitting esc key - will close drawer.
    fireEvent.keyDown(queryByTestId(dataTestIds.drawer), { key: 'Esc', code: 'Esc' });

    // action should now be closed.
    expect(queryByTestId('fake-action-form')).toBeFalsy();

    // refresh called.
    expect(mockDoRefresh).toHaveBeenCalledWith();
  });

  it('can not close action while submitting', () => {
    mockActionsForm.mockImplementation(props => {
      React.useEffect(() => {
        props.onIsSubmittingChange(true);
      });
      return <div data-testid="fake-action-form">{props.operation.path}</div>;
    });

    const { queryByTestId, mockDoRefresh } = renderHeader(mockResult);

    const fakeButton = queryByTestId('fake-ops-button');

    act(() => fakeButton.click());

    expect(mockDoRefresh).not.toHaveBeenCalledWith();

    // form should now be open.
    expect(queryByTestId('fake-action-form')).toBeTruthy();

    // try closing action form by hitting esc key - shouldn't work -
    // since submit is in progress.
    fireEvent.keyDown(queryByTestId(dataTestIds.drawer), { key: 'Esc', code: 'Esc' });

    // form should still be open.
    expect(queryByTestId('fake-action-form')).toBeTruthy();

    // and refresh still not called.
    expect(mockDoRefresh).not.toHaveBeenCalledWith();
  });
});
