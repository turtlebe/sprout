import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { useCopyToClipboard } from 'react-use';

import { useGetParentChildResources } from '../../../common/hooks';
import { useSearch } from '../../hooks/use-search';
import {
  mockResult,
  mockResultWithChildren,
  mockResultWithParent,
  mockResultWithParentAndChildren,
} from '../search/mock-search-result';

import { dataTestIdsFamilyResouresCard as dataTestIds, FamilyResouresCard } from '.';

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

jest.mock('../../../common/hooks/use-get-parent-child-resources');
const mockUseGetParentChildResources = useGetParentChildResources as jest.Mock;
mockUseGetParentChildResources.mockImplementation(() => {
  return {
    isLoading: false,
    parentResource: null,
    childResources: null,
  };
});

jest.mock('react-use/lib/useCopyToClipboard');
const mockUseCopyToClipboard = useCopyToClipboard as jest.Mock;
const mockCopyToClipboard = jest.fn();
mockUseCopyToClipboard.mockReturnValue([undefined, mockCopyToClipboard]);

const mockParentResouce = {
  containerObj: {
    serial: 'mock-parent-resource-serial',
    containerType: 'TABLE',
  },
};

const mockChildResouces = [
  {
    id: '1',
    containerObj: {
      serial: 'mock-child-resource-serial1',
      containerType: 'TRAY',
    },
  },
  {
    id: '2',
    containerObj: {
      serial: 'mock-child-resource-serial2',
      containerType: 'TRAY',
    },
  },
  {
    id: '3',
    containerObj: {
      serial: 'mock-child-resource-serial3',
      containerType: 'TRAY',
    },
  },
];

describe('FamilyResouresCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderFamilyResouresCard() {
    return render(<FamilyResouresCard />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('does not render "Family Resources" card if there is no parent and child resource', () => {
    mockUseSearch.mockReturnValue([mockResult]);

    const { queryByTestId } = renderFamilyResouresCard();

    expect(queryByTestId(dataTestIds.card)).not.toBeInTheDocument();
  });

  it('renders "Family Resources" card if there is only a parent resource', () => {
    mockUseSearch.mockReturnValue([mockResultWithParent]);

    mockUseGetParentChildResources.mockReturnValue({
      isLoading: false,
      parentResource: mockParentResouce,
      childResources: null,
    });

    const { queryByTestId } = renderFamilyResouresCard();

    expect(queryByTestId(dataTestIds.card)).toBeInTheDocument();

    expect(queryByTestId(dataTestIds.parent)).toBeInTheDocument();
    const parentResourceLink = queryByTestId(dataTestIds.parentResourceLink);
    expect(parentResourceLink).toBeInTheDocument();
    expect(parentResourceLink).toHaveTextContent(
      `${mockParentResouce.containerObj.containerType}: ${mockParentResouce.containerObj.serial}`
    );

    expect(queryByTestId(dataTestIds.children)).not.toBeInTheDocument();
  });

  it('renders "Family Resources" card if there is only a child resource', () => {
    mockUseSearch.mockReturnValue([mockResultWithChildren]);

    mockUseGetParentChildResources.mockReturnValue({
      isLoading: false,
      parentResource: null,
      childResources: mockChildResouces,
    });

    const { queryByTestId, queryAllByTestId } = renderFamilyResouresCard();

    expect(queryByTestId(dataTestIds.card)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.parent)).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.children)).toBeInTheDocument();

    const childrenLinks = queryAllByTestId(dataTestIds.childrenResourceLink);
    expect(childrenLinks).toHaveLength(mockChildResouces.length);
    childrenLinks.forEach((link, index) => {
      expect(link).toHaveTextContent(
        `${mockChildResouces[index].containerObj.containerType}: ${mockChildResouces[index].containerObj.serial}`
      );
    });
  });

  it('renders "Family Resources" card if there is both child or parent resource', () => {
    mockUseSearch.mockReturnValue([mockResultWithParentAndChildren]);
    mockUseGetParentChildResources.mockReturnValue({
      isLoading: false,
      parentResource: mockParentResouce,
      childResources: mockChildResouces,
    });

    const { queryByTestId } = renderFamilyResouresCard();

    expect(queryByTestId(dataTestIds.card)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.parent)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.children)).toBeInTheDocument();
  });

  it('renders button to copy resources when there are children', () => {
    mockUseSearch.mockReturnValue([mockResultWithChildren]);
    mockUseGetParentChildResources.mockReturnValue({
      isLoading: false,
      parentResource: null,
      childResources: mockChildResouces,
    });

    const { queryByTestId } = renderFamilyResouresCard();

    expect(queryByTestId(dataTestIds.copyButton)).toBeInTheDocument();
  });

  it('copies list of resource ids to clipboard when copy button is clicked', () => {
    mockUseSearch.mockReturnValue([mockResultWithChildren]);
    mockUseGetParentChildResources.mockReturnValue({
      isLoading: false,
      parentResource: null,
      childResources: mockChildResouces,
    });

    const { queryByTestId } = renderFamilyResouresCard();

    expect(mockCopyToClipboard).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.copyButton).click();

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      'mock-child-resource-serial1\nmock-child-resource-serial2\nmock-child-resource-serial3'
    );
  });

  it('shows loading error message when fails to load parent or child resources', () => {
    mockUseSearch.mockReturnValue([mockResultWithParentAndChildren]);
    mockUseGetParentChildResources.mockReturnValue({
      error: 'ouch',
      isLoading: false,
      parentResource: mockParentResouce,
      childResources: mockChildResouces,
    });

    const { queryByTestId } = renderFamilyResouresCard();

    expect(queryByTestId(dataTestIds.loadingError)).toHaveTextContent('ouch');
    expect(queryByTestId(dataTestIds.parent)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.children)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.copyButton)).not.toBeInTheDocument();
  });
});
