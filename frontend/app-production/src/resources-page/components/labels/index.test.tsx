import { useGetOperationsPaths } from '@plentyag/app-production/src/common/hooks/use-get-operations-paths';
import { dataTestIdsFakeTooltipTitle } from '@plentyag/brand-ui/src/test-helpers/mock-tooltip';
import { act, render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { useSearch } from '../../hooks/use-search';
import { mockResult, mockResultContainerOnly, mockResultMaterialOnly } from '../search/mock-search-result';

import { ADD_LABEL, dataTestIds, Labels, REMOVE_CONTAINER_LABEL, REMOVE_MATERIAL_LABEL } from './index';

import { useGetAddLabelOperations } from './hooks/use-get-add-label-operations';
import { NO_INFO_AVAILABLE } from './label-tooltip';

jest.mock('@plentyag/app-production/src/common/hooks/use-get-operations-paths');
const mockUseGetOperationsPaths = useGetOperationsPaths as jest.Mock;

jest.mock('./hooks/use-get-add-label-operations');
const mockUseGetAddLabelOperations = useGetAddLabelOperations as jest.Mock;
mockUseGetAddLabelOperations.mockReturnValue({ isLoading: false, foundAddLabelOperations: new Map() });

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

const mockPaths = new Map([
  [`${REMOVE_CONTAINER_LABEL}`, `sites/SSF2/interfaces/Traceability/methods/${REMOVE_CONTAINER_LABEL}`],
  [`${REMOVE_MATERIAL_LABEL}`, `sites/SSF2/interfaces/Traceability/methods/${REMOVE_MATERIAL_LABEL}`],
  [`${ADD_LABEL}`, `sites/SSF2/interfaces/Traceability/methods/${ADD_LABEL}`],
]);

// no operation
const noop = () => {};

describe('Label', () => {
  function expectAllRemoveLabelsToBeRendered(mockResult: ProdResources.ResourceState, expectedLabels: string[]) {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const { queryAllByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);
    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    expect(removeButtons.length).toBe(expectedLabels.length);
    removeButtons.forEach((button, index) => expect(button).toHaveTextContent(expectedLabels[index]));
  }

  it('shows remove container label buttons', () => {
    expectAllRemoveLabelsToBeRendered(mockResultContainerOnly, mockResultContainerOnly.containerLabels);
  });

  it('shows remove material label buttons', () => {
    expectAllRemoveLabelsToBeRendered(mockResultMaterialOnly, mockResultMaterialOnly.materialLabels);
  });

  it('shows both remove material and container label buttons', () => {
    expectAllRemoveLabelsToBeRendered(mockResult, mockResult.containerLabels.concat(mockResult.materialLabels));
  });

  it('disables remove and add label buttons when operation paths not found', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      const mockPaths = new Map();
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const { queryAllByTestId, queryByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);

    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    removeButtons.forEach(button => expect(button).toBeDisabled());

    const addButton = queryByTestId(dataTestIds.addButton);
    expect(addButton).toBeDisabled();
  });

  it('enables remove and add label buttons when operation paths found', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const { queryAllByTestId, queryByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);

    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    removeButtons.forEach(button => expect(button).not.toBeDisabled());

    const addButton = queryByTestId(dataTestIds.addButton);
    expect(addButton).not.toBeDisabled();
  });

  it('disables remove and add label buttons when loading operations path', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: true, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const { queryAllByTestId, queryByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);

    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    removeButtons.forEach(button => expect(button).toBeDisabled());

    const addButton = queryByTestId(dataTestIds.addButton);
    expect(addButton).toBeDisabled();
  });

  it('disables remove and add label buttons when resource isLatest is false', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    const mockResultHistoric = cloneDeep(mockResult);
    // update data to indicate isLatest is false --> historic data, so buttons should all be disabled.
    mockResultHistoric.isLatest = false;
    mockUseSearch.mockReturnValue([mockResultHistoric]);

    const { queryAllByTestId, queryByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);

    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    removeButtons.forEach(button => expect(button).toBeDisabled());

    const addButton = queryByTestId(dataTestIds.addButton);
    expect(addButton).toBeDisabled();
  });

  it('invokes "RemoveContainerLabel" callback with operation when label is clicked', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResultContainerOnly]);

    const mockRemoveLabel = jest.fn();

    const { queryAllByTestId } = render(<Labels removeLabel={mockRemoveLabel} addLabel={noop} />);

    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    expect(removeButtons.length).toBeGreaterThan(0);

    act(() => removeButtons[0].click());

    expect(mockRemoveLabel).toHaveBeenCalledWith({
      path: mockPaths.get(`${REMOVE_CONTAINER_LABEL}`),
      prefilledArgs: {
        id: { isDisabled: true, value: mockResultContainerOnly.containerObj.serial },
        label: { isDisabled: true, value: mockResultContainerOnly.containerLabels[0] },
        is_rework: { isDisabled: false, value: true },
      },
      context: {
        materialType: undefined,
        containerType: mockResultContainerOnly.containerObj.containerType,
      },
    });
  });

  it('invokes "RemoveMaterialLabel" callback with operation when label is clicked', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResultMaterialOnly]);

    const mockRemoveLabel = jest.fn();

    const { queryAllByTestId } = render(<Labels removeLabel={mockRemoveLabel} addLabel={noop} />);

    const removeButtons = queryAllByTestId(dataTestIds.removeButton);
    expect(removeButtons.length).toBeGreaterThan(0);

    act(() => removeButtons[0].click());

    expect(mockRemoveLabel).toHaveBeenCalledWith({
      path: mockPaths.get(`${REMOVE_MATERIAL_LABEL}`),
      prefilledArgs: {
        id: { isDisabled: true, value: mockResultMaterialOnly.materialObj.lotName },
        label: { isDisabled: true, value: mockResultMaterialOnly.materialLabels[0] },
      },
      context: {
        materialType: mockResultMaterialOnly.materialObj.materialType,
        containerType: undefined,
      },
    });
  });

  it('invokes "AddLabelGeneral" callback with operation when label is clicked', () => {
    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const mockAddLabel = jest.fn();

    const { queryByTestId } = render(<Labels removeLabel={noop} addLabel={mockAddLabel} />);

    act(() => queryByTestId(dataTestIds.addButton).click());

    expect(mockAddLabel).toHaveBeenCalledWith({
      path: mockPaths.get(`${ADD_LABEL}`),
      prefilledArgs: {
        id: { isDisabled: true, value: mockResult.containerObj.serial },
      },
      context: {
        materialType: mockResult.materialObj.materialType,
        containerType: mockResult.containerObj.containerType,
        existingLabels: mockResult.materialLabels.concat(mockResult.containerLabels),
      },
    });
  });

  it('shows loading progress on tooltip while waiting on backend data', () => {
    mockUseGetAddLabelOperations.mockReturnValue({ isLoading: true, foundAddLabelOperations: new Map() });

    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const { queryAllByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);

    const tooltips = queryAllByTestId(dataTestIdsFakeTooltipTitle.title);
    expect(tooltips).toHaveLength(4); // four tooltips because there are four labels in "mockResult"
    tooltips.forEach(tooltip => expect(tooltip).toHaveTextContent('Loading...'));
  });

  it('shows material/container tooltips for remove label buttons', () => {
    mockUseGetAddLabelOperations.mockImplementation((labelType: ProdResources.LabelTypes) => {
      if (labelType === 'MATERIAL') {
        return {
          isLoading: false,
          foundAddLabelOperations: new Map([['mlabel1', { endDt: '2020-12-07T23:37:54.174' }]]),
        };
      }
      if (labelType === 'CONTAINER') {
        return {
          isLoading: false,
          foundAddLabelOperations: new Map([['clabel1', { endDt: '2021-12-07T23:37:54.174' }]]),
        };
      }
      return { isLoading: false, foundAddLabelOperations: new Map() };
    });

    mockUseGetOperationsPaths.mockImplementation(() => {
      return { isLoading: false, operationPaths: mockPaths };
    });

    mockUseSearch.mockReturnValue([mockResult]);

    const { queryAllByTestId } = render(<Labels removeLabel={noop} addLabel={noop} />);

    const tooltips = queryAllByTestId(dataTestIdsFakeTooltipTitle.title);

    expect(tooltips).toHaveLength(4);
    expect(tooltips[0]).toHaveTextContent('Label Created: 12/07/2021 11:37:54 PM'); // label: clabel1
    expect(tooltips[1]).toHaveTextContent(NO_INFO_AVAILABLE); // no label operation data for: clabel2
    expect(tooltips[2]).toHaveTextContent('Label Created: 12/07/2020 11:37:54 PM'); // label: mlabel1
    expect(tooltips[3]).toHaveTextContent(NO_INFO_AVAILABLE); // no label operations data for : mlabel2
  });
});
